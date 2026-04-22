import { runSeoOptimizationLoop } from "./core/loop"

async function main() {
  console.log("[seo-agent] Starting autonomous SEO optimization loop...")

  const result = await runSeoOptimizationLoop()

  if (result.success) {
    console.log(`[seo-agent] Success: ${result.reason}`)
    console.log(
      `[seo-agent] Best scores -> SEO: ${result.bestScores.seo}, Performance: ${result.bestScores.performance}, Accessibility: ${result.bestScores.accessibility}`,
    )
    process.exitCode = 0
    return
  }

  console.error(`[seo-agent] Stopped: ${result.reason}`)
  console.error(
    `[seo-agent] Best scores -> SEO: ${result.bestScores.seo}, Performance: ${result.bestScores.performance}, Accessibility: ${result.bestScores.accessibility}`,
  )
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`[seo-agent] Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
