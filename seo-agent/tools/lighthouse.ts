import fs from "node:fs/promises"
import path from "node:path"
import lighthouse from "lighthouse"
import { launch } from "chrome-launcher"

export type LighthouseAudit = {
  id: string
  title: string
  description: string
  score: number
  displayValue?: string
  numericValue?: number
}

export type LighthouseSummary = {
  scores: {
    performance: number
    seo: number
    accessibility: number
  }
  failedAudits: LighthouseAudit[]
  reportPath: string
}

type LighthouseOptions = {
  url: string
  outputDir: string
  reportName: string
  chromeFlags: string[]
  onlyCategories: Array<"performance" | "seo" | "accessibility">
}

type LighthouseAuditResult = {
  id: string
  title: string
  description: string
  score: number | null
  scoreDisplayMode?: string
  displayValue?: string
  numericValue?: number
}

function normalizeCategoryScore(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) return 0
  return Math.round(value * 100)
}

async function detectChromePath(): Promise<string | undefined> {
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    return process.env.LIGHTHOUSE_CHROME_PATH
  }

  const candidatePaths = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ]

  for (const candidate of candidatePaths) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // Try next candidate path.
    }
  }

  return undefined
}

export async function runLighthouseAudit(options: LighthouseOptions): Promise<LighthouseSummary> {
  await fs.mkdir(options.outputDir, { recursive: true })

  const chromePath = await detectChromePath()
  const chrome = await launch({
    chromeFlags: options.chromeFlags,
    ...(chromePath ? { chromePath } : {}),
  })

  try {
    const runnerResult = await lighthouse(options.url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: options.onlyCategories,
    })

    if (!runnerResult || !runnerResult.lhr) {
      throw new Error("Lighthouse returned no report")
    }

    const reportString = typeof runnerResult.report === "string"
      ? runnerResult.report
      : JSON.stringify(runnerResult.report, null, 2)

    const reportPath = path.resolve(options.outputDir, `${options.reportName}.json`)
    await fs.writeFile(reportPath, reportString, "utf8")

    const lhr = runnerResult.lhr

    const failedAudits: LighthouseAudit[] = (Object.values(lhr.audits) as LighthouseAuditResult[])
      .filter((audit) => {
        if (!audit) return false

        const mode = audit.scoreDisplayMode
        if (mode === "notApplicable" || mode === "informative" || mode === "manual") return false
        if (audit.score === null || audit.score === undefined) return false

        return audit.score < 0.9
      })
      .map((audit) => ({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: Math.round((audit.score ?? 0) * 100),
        displayValue: audit.displayValue,
        numericValue: audit.numericValue,
      }))
      .sort((a, b) => a.score - b.score)

    return {
      scores: {
        performance: normalizeCategoryScore(lhr.categories.performance?.score),
        seo: normalizeCategoryScore(lhr.categories.seo?.score),
        accessibility: normalizeCategoryScore(lhr.categories.accessibility?.score),
      },
      failedAudits,
      reportPath,
    }
  } finally {
    await chrome.kill()
  }
}
