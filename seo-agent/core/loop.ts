import fs from "node:fs/promises"
import path from "node:path"
import { agentConfig, type AgentConfig } from "../config"
import { runBuild, runCommand } from "../tools/build"
import { startDevServer } from "../tools/dev"
import { restoreChanges } from "../tools/file"
import { runLighthouseAudit, type LighthouseSummary } from "../tools/lighthouse"
import { analyzeAuditResults } from "./analyzer"
import { applyFixes } from "./fixer"

export type LoopResult = {
  success: boolean
  reason: string
  iterations: number
  history: LighthouseSummary["scores"][]
  bestScores: LighthouseSummary["scores"]
}

function formatDelta(current: number, previous: number | null): string {
  if (previous === null) return "n/a"
  const delta = current - previous
  const sign = delta > 0 ? "+" : ""
  return `${sign}${delta}`
}

function getBestScores(history: LighthouseSummary["scores"][]): LighthouseSummary["scores"] {
  if (history.length === 0) {
    return {
      performance: 0,
      seo: 0,
      accessibility: 0,
    }
  }

  return history.reduce(
    (best, current) => ({
      performance: Math.max(best.performance, current.performance),
      seo: Math.max(best.seo, current.seo),
      accessibility: Math.max(best.accessibility, current.accessibility),
    }),
    {
      performance: 0,
      seo: 0,
      accessibility: 0,
    },
  )
}

async function projectHasAnalyzeScript(projectRoot: string): Promise<boolean> {
  const packageJsonPath = path.join(projectRoot, "package.json")

  try {
    const content = await fs.readFile(packageJsonPath, "utf8")
    const parsed = JSON.parse(content) as { scripts?: Record<string, string> }
    return Boolean(parsed.scripts?.analyze)
  } catch {
    return false
  }
}

export async function runSeoOptimizationLoop(config: AgentConfig = agentConfig): Promise<LoopResult> {
  await fs.mkdir(config.lighthouse.outputDir, { recursive: true })

  const history: LighthouseSummary["scores"][] = []
  const hasAnalyzeScript = await projectHasAnalyzeScript(config.projectRoot)

  let previousScores: LighthouseSummary["scores"] | null = null
  let bundleAnalyzerExecuted = false

  for (let iteration = 1; iteration <= config.maxIterations; iteration += 1) {
    console.log(`\n[seo-agent] Iteration ${iteration}/${config.maxIterations}`)

    const buildResult = await runBuild(config.projectRoot, config.buildCommand)
    if (!buildResult.ok) {
      return {
        success: false,
        reason: "Build failed before Lighthouse run.",
        iterations: iteration,
        history,
        bestScores: getBestScores(history),
      }
    }

    let lighthouseResult: LighthouseSummary
    let serverOutput = ""

    const server = await startDevServer({
      cwd: config.projectRoot,
      command: config.startCommand,
      targetUrl: config.targetUrl,
      readyTimeoutMs: config.serverReadyTimeoutMs,
    })

    try {
      lighthouseResult = await runLighthouseAudit({
        url: config.targetUrl,
        outputDir: config.lighthouse.outputDir,
        reportName: `lighthouse-iteration-${iteration}`,
        chromeFlags: config.lighthouse.chromeFlags,
        onlyCategories: config.lighthouse.onlyCategories,
      })
    } catch (error) {
      serverOutput = server.output()
      await server.stop()

      return {
        success: false,
        reason: `Lighthouse failed: ${error instanceof Error ? error.message : String(error)}\nServer output:\n${serverOutput}`,
        iterations: iteration,
        history,
        bestScores: getBestScores(history),
      }
    }

    serverOutput = server.output()
    await server.stop()

    history.push(lighthouseResult.scores)

    console.log(
      [
        "[seo-agent] Scores",
        `Performance: ${lighthouseResult.scores.performance} (delta: ${formatDelta(lighthouseResult.scores.performance, previousScores?.performance ?? null)})`,
        `SEO: ${lighthouseResult.scores.seo} (delta: ${formatDelta(lighthouseResult.scores.seo, previousScores?.seo ?? null)})`,
        `Accessibility: ${lighthouseResult.scores.accessibility} (delta: ${formatDelta(lighthouseResult.scores.accessibility, previousScores?.accessibility ?? null)})`,
      ].join(" | "),
    )

    console.log(`[seo-agent] Lighthouse report saved at: ${lighthouseResult.reportPath}`)

    const analysis = analyzeAuditResults(lighthouseResult, config.scoreTargets)

    if (
      lighthouseResult.scores.seo >= config.scoreTargets.seo &&
      lighthouseResult.scores.performance >= config.scoreTargets.performance
    ) {
      return {
        success: true,
        reason: "Target scores reached.",
        iterations: iteration,
        history,
        bestScores: getBestScores(history),
      }
    }

    if (analysis.issues.length === 0) {
      return {
        success: false,
        reason: "No relevant actionable audits left for deterministic fixer.",
        iterations: iteration,
        history,
        bestScores: getBestScores(history),
      }
    }

    console.log("[seo-agent] Top failed audits considered:")
    for (const issue of analysis.issues.slice(0, 8)) {
      console.log(`  - ${issue.id} | ${issue.priority} | score ${issue.score}`)
    }

    const fixResult = await applyFixes(config.projectRoot, analysis.issues)

    console.log("[seo-agent] Fix prompt generated for deterministic agent:")
    console.log(fixResult.prompt)

    for (const note of fixResult.notes) {
      console.log(`[seo-agent] ${note}`)
    }

    if (fixResult.changes.length === 0) {
      return {
        success: false,
        reason: "Fixer did not produce file changes for the current audit set.",
        iterations: iteration,
        history,
        bestScores: getBestScores(history),
      }
    }

    console.log(`[seo-agent] Changed files in this iteration: ${fixResult.changes.length}`)

    const validationBuild = await runBuild(config.projectRoot, config.buildCommand)

    if (!validationBuild.ok) {
      console.log("[seo-agent] Build failed after fixes. Reverting last change set.")
      await restoreChanges(fixResult.changes)

      const recoveryBuild = await runBuild(config.projectRoot, config.buildCommand)
      if (!recoveryBuild.ok) {
        return {
          success: false,
          reason: "Build failed after rollback. Manual intervention required.",
          iterations: iteration,
          history,
          bestScores: getBestScores(history),
        }
      }

      console.log("[seo-agent] Rollback applied successfully.")
      previousScores = lighthouseResult.scores
      continue
    }

    if (!bundleAnalyzerExecuted && hasAnalyzeScript && analysis.shouldInspectBundle) {
      console.log("[seo-agent] Running bundle analyzer (one-time) for performance hints...")
      const analyzeRun = await runCommand(config.projectRoot, ["npm", "run", "analyze"], "bundle-analyze")

      if (analyzeRun.ok) {
        console.log("[seo-agent] Bundle analyzer build completed.")
      } else {
        console.log("[seo-agent] Bundle analyzer failed, continuing without it.")
      }

      bundleAnalyzerExecuted = true
    }

    if (!serverOutput.trim()) {
      console.log("[seo-agent] Server log output was empty for this iteration.")
    }

    previousScores = lighthouseResult.scores
  }

  return {
    success: false,
    reason: "Maximum iteration count reached before hitting targets.",
    iterations: config.maxIterations,
    history,
    bestScores: getBestScores(history),
  }
}
