import path from "node:path"
import { applyTextTransform, listSourceFiles, type AppliedChange } from "../tools/file"
import type { AnalyzedIssue } from "./analyzer"

export type FixResult = {
  changes: AppliedChange[]
  notes: string[]
  prompt: string
}

const METADATA_AUDITS = new Set([
  "document-title",
  "meta-description",
  "canonical",
  "hreflang",
])

const IMAGE_AUDITS = new Set([
  "image-alt",
  "uses-responsive-images",
  "offscreen-images",
  "uses-optimized-images",
])

const PERFORMANCE_AUDITS = new Set([
  "unused-javascript",
  "render-blocking-resources",
  "total-byte-weight",
  "largest-contentful-paint-element",
])

function hasAudit(issues: AnalyzedIssue[], auditSet: Set<string>): boolean {
  return issues.some((issue) => auditSet.has(issue.id))
}

function hasArea(issues: AnalyzedIssue[], area: AnalyzedIssue["area"]): boolean {
  return issues.some((issue) => issue.area === area)
}

export function buildFixPrompt(issues: AnalyzedIssue[]): string {
  const issueLines = issues
    .slice(0, 10)
    .map((issue) => `- [${issue.priority}] ${issue.id} (${issue.score}/100): ${issue.title}`)
    .join("\n")

  return [
    "You are a deterministic Next.js SEO optimizer.",
    "Apply safe, minimal and production-ready code changes.",
    "Focus areas: title, metadata descriptions, heading structure, image alt text, next/image usage, lazy loading, and bundle weight.",
    "Never introduce risky refactors. Keep build stable.",
    "Issues:",
    issueLines || "- No relevant issues found",
  ].join("\n")
}

async function fixDynamicPageMetadata(projectRoot: string): Promise<AppliedChange | null> {
  const targetFile = path.join(projectRoot, "app", "[lang]", "[[...file]]", "page.tsx")

  return applyTextTransform(targetFile, (source) => {
    let updated = source

    if (!updated.includes("DESCRIPTION_MAX")) {
      const helperBlock = [
        "const DESCRIPTION_MIN = 140",
        "const DESCRIPTION_MAX = 160",
        "",
        "function clampMetaDescription(content: string): string {",
        "  const normalized = content.replace(/\\s+/g, \" \" ).trim()",
        "  if (normalized.length <= DESCRIPTION_MAX) return normalized",
        "  return `${normalized.slice(0, DESCRIPTION_MAX - 1).trimEnd()}.`",
        "}",
        "",
        "function buildPageDescription(pageTitle: string, lang: string): string {",
        "  const baseDescription = lang === \"pt\"",
        "    ? `${pageTitle} no portfolio de ${metadataJson.author.name}. Projetos reais, experiencias tecnicas e foco em performance, SEO e acessibilidade.`",
        "    : `${pageTitle} on ${metadataJson.author.name}'s portfolio. Real projects, technical highlights, and focus on performance, SEO, and accessibility.`",
        "",
        "  if (baseDescription.length < DESCRIPTION_MIN) {",
        "    return clampMetaDescription(`${baseDescription} Production ready software engineering with measurable business impact.`)",
        "  }",
        "",
        "  return clampMetaDescription(baseDescription)",
        "}",
      ].join("\n")

      updated = updated.replace(
        "export const dynamicParams = false\n",
        `export const dynamicParams = false\n\n${helperBlock}\n`,
      )
    }

    const pagePathLine = "  const pagePath = fileId === defaultFile ? `/${lang}` : `/${lang}/${fileId}`\n"
    if (updated.includes(pagePathLine) && !updated.includes("const pageTitle =")) {
      const metadataVars = [
        pagePathLine.trimEnd(),
        "  const pageTitle = `${entry.title} | ${metadataJson.site.title}`",
        "  const pageDescription = buildPageDescription(entry.title, lang)",
        "  const imageUrl = `${baseUrl}${metadataJson.openGraph.image}`",
        "",
      ].join("\n")

      updated = updated.replace(pagePathLine, `${metadataVars}\n`)
    }

    updated = updated.replace("title: `${entry.title} | ${metadataJson.site.title}`,", "title: pageTitle,")
    updated = updated.replace("description: metadataJson.site.description,", "description: pageDescription,")

    if (!updated.includes("openGraph:")) {
      const openGraphBlock = [
        "    keywords: metadataJson.site.keywords,",
        "    openGraph: {",
        "      title: pageTitle,",
        "      description: pageDescription,",
        "      url: `${baseUrl}${pagePath}`,",
        "      siteName: metadataJson.site.title,",
        "      locale: lang === \"pt\" ? \"pt-BR\" : \"en-US\",",
        "      type: \"website\",",
        "      images: [",
        "        {",
        "          url: imageUrl,",
        "          width: metadataJson.openGraph.imageWidth,",
        "          height: metadataJson.openGraph.imageHeight,",
        "          alt: `${entry.title} | ${metadataJson.site.title}`,",
        "        },",
        "      ],",
        "    },",
        "    twitter: {",
        "      card: \"summary_large_image\",",
        "      title: pageTitle,",
        "      description: pageDescription,",
        "      images: [imageUrl],",
        "    },",
      ].join("\n")

      updated = updated.replace("    keywords: metadataJson.site.keywords,", openGraphBlock)
    }

    return updated
  })
}

async function fixMissingImageAltText(projectRoot: string): Promise<AppliedChange[]> {
  const roots = [
    path.join(projectRoot, "app"),
    path.join(projectRoot, "components"),
  ]

  const changes: AppliedChange[] = []

  for (const root of roots) {
    const files = await listSourceFiles(root, [".tsx", ".jsx"], ["node_modules", ".next", "seo-agent"])

    for (const filePath of files) {
      const changed = await applyTextTransform(filePath, (source) => {
        const imgWithoutAlt = /<img\b(?![^>]*\balt=)([^>]*?)\/?>(?!<\/img>)/g
        return source.replace(imgWithoutAlt, (tag) => tag.replace("<img", "<img alt=\"Portfolio image\""))
      })

      if (changed) changes.push(changed)
    }
  }

  return changes
}

async function optimizeProjectImages(projectRoot: string): Promise<AppliedChange | null> {
  const targetFile = path.join(projectRoot, "components", "sections", "projects.tsx")

  return applyTextTransform(targetFile, (source) => {
    let updated = source

    if (!updated.includes("loading={project.featured ? \"eager\" : \"lazy\"}")) {
      updated = updated.replace(
        "                    priority={project.featured}\n                    quality={75}",
        [
          "                    priority={project.featured}",
          "                    loading={project.featured ? \"eager\" : \"lazy\"}",
          "                    fetchPriority={project.featured ? \"high\" : \"auto\"}",
          "                    quality={project.featured ? 80 : 70}",
        ].join("\n"),
      )
    }

    return updated
  })
}

async function addNetworkHintsToLayout(projectRoot: string): Promise<AppliedChange | null> {
  const targetFile = path.join(projectRoot, "app", "[lang]", "layout.tsx")

  return applyTextTransform(targetFile, (source) => {
    if (source.includes('rel="dns-prefetch" href="https://github.com"')) {
      return source
    }

    const insertionPoint = "        <style>{`html,body{min-height:100%;background:#1e1e1e;color:#f5f5f5}#hero{min-height:100svh}`}</style>"
    const hints = [
      insertionPoint,
      "        <link rel=\"dns-prefetch\" href=\"https://github.com\" />",
      "        <link rel=\"preconnect\" href=\"https://github.com\" crossOrigin=\"anonymous\" />",
      "        <link rel=\"dns-prefetch\" href=\"https://www.linkedin.com\" />",
      "        <link rel=\"preconnect\" href=\"https://www.linkedin.com\" crossOrigin=\"anonymous\" />",
    ].join("\n")

    return source.replace(insertionPoint, hints)
  })
}

export async function applyFixes(projectRoot: string, issues: AnalyzedIssue[]): Promise<FixResult> {
  const changes: AppliedChange[] = []
  const notes: string[] = []
  const prompt = buildFixPrompt(issues)

  if (hasAudit(issues, METADATA_AUDITS) || hasArea(issues, "meta-tags") || hasArea(issues, "seo")) {
    const metadataChange = await fixDynamicPageMetadata(projectRoot)
    if (metadataChange) {
      changes.push(metadataChange)
      notes.push("Updated dynamic metadata generation with page-specific descriptions and social metadata.")
    }
  }

  if (hasAudit(issues, IMAGE_AUDITS) || hasArea(issues, "images") || hasArea(issues, "accessibility")) {
    const imageAltChanges = await fixMissingImageAltText(projectRoot)
    if (imageAltChanges.length > 0) {
      changes.push(...imageAltChanges)
      notes.push(`Added missing alt attributes in ${imageAltChanges.length} file(s).`)
    }

    const imageOptimizationChange = await optimizeProjectImages(projectRoot)
    if (imageOptimizationChange) {
      changes.push(imageOptimizationChange)
      notes.push("Improved Next.js Image loading strategy in projects section.")
    }
  }

  if (hasAudit(issues, PERFORMANCE_AUDITS) || hasArea(issues, "performance")) {
    const networkHintsChange = await addNetworkHintsToLayout(projectRoot)
    if (networkHintsChange) {
      changes.push(networkHintsChange)
      notes.push("Added preconnect and dns-prefetch hints for external profile domains.")
    }
  }

  return {
    changes,
    notes,
    prompt,
  }
}
