import type { ScoreTargets } from "../config"
import type { LighthouseAudit, LighthouseSummary } from "../tools/lighthouse"

export type IssuePriority = "critical" | "high" | "medium" | "low"
export type IssueArea = "seo" | "meta-tags" | "images" | "accessibility" | "performance"

export type AnalyzedIssue = {
  id: string
  title: string
  description: string
  score: number
  area: IssueArea
  priority: IssuePriority
  displayValue?: string
  numericValue?: number
}

export type AnalysisResult = {
  issues: AnalyzedIssue[]
  shouldInspectBundle: boolean
}

const DIRECT_AREA_MAP: Record<string, IssueArea> = {
  "document-title": "meta-tags",
  "meta-description": "meta-tags",
  canonical: "seo",
  hreflang: "seo",
  "image-alt": "images",
  "uses-responsive-images": "images",
  "offscreen-images": "images",
  "uses-optimized-images": "images",
  "heading-order": "accessibility",
  "color-contrast": "accessibility",
  "aria-allowed-attr": "accessibility",
  "aria-required-attr": "accessibility",
  "button-name": "accessibility",
  "link-name": "accessibility",
  "unused-javascript": "performance",
  "render-blocking-resources": "performance",
  "total-byte-weight": "performance",
  "largest-contentful-paint-element": "performance",
}

const RELEVANT_PATTERN = /seo|meta|title|description|canonical|hreflang|image|alt|heading|aria|contrast|javascript|byte|lcp|cls|fcp|ttfb|render-blocking/i

function inferArea(audit: LighthouseAudit): IssueArea {
  if (DIRECT_AREA_MAP[audit.id]) return DIRECT_AREA_MAP[audit.id]

  const text = `${audit.id} ${audit.title}`

  if (/meta|title|description|canonical|hreflang/i.test(text)) return "meta-tags"
  if (/image|alt/i.test(text)) return "images"
  if (/aria|heading|contrast|label|accessibility/i.test(text)) return "accessibility"
  if (/javascript|byte|lcp|cls|fcp|ttfb|render-blocking|speed|performance/i.test(text)) return "performance"

  return "seo"
}

function inferPriority(score: number): IssuePriority {
  if (score < 50) return "critical"
  if (score < 75) return "high"
  if (score < 90) return "medium"
  return "low"
}

function priorityWeight(priority: IssuePriority): number {
  if (priority === "critical") return 0
  if (priority === "high") return 1
  if (priority === "medium") return 2
  return 3
}

export function analyzeAuditResults(report: LighthouseSummary, targets: ScoreTargets): AnalysisResult {
  const filtered = report.failedAudits.filter((audit) => {
    const text = `${audit.id} ${audit.title} ${audit.description}`
    return RELEVANT_PATTERN.test(text)
  })

  const issues: AnalyzedIssue[] = filtered
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      area: inferArea(audit),
      priority: inferPriority(audit.score),
      displayValue: audit.displayValue,
      numericValue: audit.numericValue,
    }))
    .sort((a, b) => {
      const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority)
      if (priorityDiff !== 0) return priorityDiff
      return a.score - b.score
    })

  const shouldInspectBundle = report.scores.performance < targets.performance ||
    issues.some((issue) => issue.id === "unused-javascript" || issue.id === "total-byte-weight")

  return {
    issues,
    shouldInspectBundle,
  }
}
