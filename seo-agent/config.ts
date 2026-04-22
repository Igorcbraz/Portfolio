import path from "node:path"

export type ScoreTargets = {
  seo: number
  performance: number
  accessibility: number
}

export type LighthouseAgentConfig = {
  chromeFlags: string[]
  onlyCategories: Array<"performance" | "seo" | "accessibility">
  outputDir: string
}

export type AgentConfig = {
  projectRoot: string
  targetUrl: string
  port: number
  maxIterations: number
  scoreTargets: ScoreTargets
  buildCommand: string[]
  startCommand: string[]
  serverReadyTimeoutMs: number
  lighthouse: LighthouseAgentConfig
}

export const agentConfig: AgentConfig = {
  projectRoot: path.resolve(process.cwd()),
  targetUrl: "http://localhost:3000",
  port: 3000,
  maxIterations: 8,
  scoreTargets: {
    seo: 100,
    performance: 95,
    accessibility: 95,
  },
  buildCommand: ["npm", "run", "build"],
  startCommand: ["npm", "run", "start", "--", "-p", "3000"],
  serverReadyTimeoutMs: 45_000,
  lighthouse: {
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
    onlyCategories: ["performance", "seo", "accessibility"],
    outputDir: path.resolve(process.cwd(), "seo-agent", "reports"),
  },
}
