"use client"

import { useMemo } from "react"
import { useVSCode } from "@/contexts/VSCodeContext"
import { mockFiles } from "@/data/mock-files"

function tokenize(code: string, extension: string) {
  const tokens: { text: string; type: string }[] = []
  let remaining = code

  const cssRules = [
    { regex: /^\/\*[\s\S]*?\*\//, type: "comment" },
    { regex: /^@\w+/, type: "keyword" },
    { regex: /^url\([^)]*\)/, type: "string" },
    { regex: /^"[^"]*"|^'[^']*'/, type: "string" },
    { regex: /^#[a-fA-F0-9]{3,8}/, type: "constant" },
    { regex: /^[-+]?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|ms|s|deg)?/, type: "number" },
    { regex: /^:[a-zA-Z-]+\b/, type: "property" },
    { regex: /^[a-zA-Z-][a-zA-Z0-9-]*\b(?=\s*:)/, type: "property" },
    { regex: /^[a-zA-Z-][a-zA-Z0-9-]*\b/, type: "class" },
    { regex: /^\s+/, type: "whitespace" },
    { regex: /^./, type: "text" }
  ]

  const mdRules = [
    { regex: /^<!--[\s\S]*?-->/, type: "comment" },
    { regex: /^#{1,6}\s+.*(?=\n|$)/, type: "class" },
    { regex: /^[*_]{1,3}[^*_]+[*_]{1,3}/, type: "string" },
    { regex: /^`[^`]+`/, type: "keyword" },
    { regex: /^\[[^\]]+\]\([^)]+\)/, type: "function" },
    { regex: /^-\s+|^\*\s+|^\d+\.\s+/, type: "keyword" },
    { regex: /^\s+/, type: "whitespace" },
    { regex: /^./, type: "text" }
  ]

  const codeRules = [
    { regex: /^\/\/.*|^\/\*[\s\S]*?\*\//, type: "comment" },
    { regex: /^`(?:\\`|[^`])*`|^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/, type: "string" },
    { regex: /^\b(const|let|var|function|return|import|from|export|default|class|extends|interface|type|public|private|as|implements|new|typeof|instanceof|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|async|await|yield|void|static|get|set|in|of|keyof|readonly)\b/, type: "keyword" },
    { regex: /^\b(true|false|null|undefined)\b/, type: "constant" },
    { regex: /^\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)\b/, type: "number" },
    { regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/, type: "function" },
    { regex: /^[A-Z][a-zA-Z0-9_$]*/, type: "class" },
    { regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/, type: "variable" },
    { regex: /^\s+/, type: "whitespace" },
    { regex: /^./, type: "text" }
  ]

  const rules = extension === "css" ? cssRules : extension === "md" ? mdRules : codeRules

  while (remaining.length > 0) {
    let matched = false
    for (const rule of rules) {
      const match = remaining.match(rule.regex)
      if (match && match.index === 0) {
        const text = match[0]
        tokens.push({ text, type: rule.type })
        remaining = remaining.slice(text.length)
        matched = true
        break
      }
    }
    if (!matched) {
      const text = remaining[0]
      tokens.push({ text, type: "text" })
      remaining = remaining.slice(1)
    }
  }
  return tokens
}

export default function CodeView() {
  const { activeFile, theme } = useVSCode()

  const extension = useMemo(() => {
    const parts = activeFile.split(".")
    return parts[parts.length - 1] || "txt"
  }, [activeFile])

  const codeContent = useMemo(() => {
    return mockFiles[activeFile] || `// No content found for ${activeFile}`
  }, [activeFile])

  const tokenizedLines = useMemo(() => {
    const rawLines = codeContent.split("\n")
    return rawLines.map(line => tokenize(line, extension))
  }, [codeContent, extension])

  const getTokenStyle = (type: string) => {
    const tokenColors = theme.tokenColors
    if (!tokenColors) return {}

    switch (type) {
      case "comment":
        return { color: tokenColors.comment || "#7a7a7a", fontStyle: "italic" }
      case "string":
        return { color: tokenColors.string || "#a8ff60" }
      case "keyword":
        return { color: tokenColors.keyword || "#96cbfe" }
      case "constant":
        return { color: tokenColors.constant || "#ff73fd" }
      case "number":
        return { color: tokenColors.number || "#ff9e5e" }
      case "function":
        return { color: tokenColors.function || "#ffd2a6" }
      case "class":
        return { color: tokenColors.class || "#ffffb6" }
      case "variable":
        return { color: tokenColors.variable || "#c6c5fe" }
      case "property":
        return { color: tokenColors.property || "#c6c5fe" }
      default:
        return { color: theme.colors["editor.foreground"] || "#f8f8f2" }
    }
  };

  return (
    <div
      className="min-h-screen p-6 font-mono text-sm leading-relaxed overflow-x-auto select-text selection:bg-white/20"
      style={{
        backgroundColor: theme.colors["editor.background"],
        color: theme.colors["editor.foreground"] || "#f8f8f2"
      }}
    >
      <div className="flex font-mono min-w-max">
        <div
          className="text-right pr-4 select-none border-r border-dashed border-opacity-10 mr-4"
          style={{
            color: theme.colors["editorLineNumber.foreground"] || "rgba(255, 255, 255, 0.3)",
            borderColor: theme.colors["editorGroup.border"] || "rgba(255, 255, 255, 0.1)"
          }}
        >
          {tokenizedLines.map((_, index) => (
            <div key={index} className="h-6 leading-6 text-xs text-[11px] font-sans pr-1">
              {index + 1}
            </div>
          ))}
        </div>

        <div className="flex-1">
          {tokenizedLines.map((lineTokens, lineIdx) => (
            <div key={lineIdx} className="h-6 leading-6 text-xs whitespace-pre">
              {lineTokens.length === 0 || (lineTokens.length === 1 && lineTokens[0].text === "") ? (
                <span> </span>
              ) : (
                lineTokens.map((token, tokenIdx) => (
                  <span key={tokenIdx} style={getTokenStyle(token.type)}>
                    {token.text}
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
