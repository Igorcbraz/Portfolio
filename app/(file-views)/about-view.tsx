"use client"

import aboutEn from "@/data/about/en.json"
import aboutPt from "@/data/about/pt.json"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { RenderJsonWithSyntaxHighlight } from "@/components/features"

export default function AboutView() {
  const { locale } = useLocale()
  const { theme } = useVSCode()

  const igorData = (locale === "pt" ? aboutPt : aboutEn) as Record<string, unknown>

  return (
    <div
      className="min-h-screen p-8 font-mono text-sm"
      style={{
        backgroundColor: theme.colors["editor.background"],
        color: theme.colors["editor.foreground"]
      }}
    >
      <pre className="text-xs leading-relaxed whitespace-pre-wrap wrap-break-word overflow-x-auto">
        <code className="language-json">
          <RenderJsonWithSyntaxHighlight value={igorData} />
        </code>
      </pre>
    </div>
  )
}
