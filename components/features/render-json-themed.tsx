"use client"

import type { JSX } from "react"
import { useVSCode } from "@/contexts/VSCodeContext"

type Primitive = string | number | boolean | null
type JsonValue = Primitive | JsonArray | JsonObject

interface JsonArray extends Array<JsonValue> { }

interface JsonObject {
  [key: string]: JsonValue
}

type RenderContext = {
  keyLabel?: string
  isLast: boolean
  path: string
}

export function RenderJsonWithSyntaxHighlight({ value, indent = 0 }: { value: unknown; indent?: number }) {
  const { theme } = useVSCode()

  const renderValue = (value: JsonValue, indent: number, ctx: RenderContext): JSX.Element[] => {
    const { keyLabel, isLast, path } = ctx
    const lines: JSX.Element[] = []
    const indentation = "  ".repeat(indent)
    const comma = isLast ? "" : ","
    const keyPart = keyLabel ? (
      <>
        <span style={{ color: theme.tokenColors.property }}>"{keyLabel}"</span>: {" "}
      </>
    ) : null

    if (Array.isArray(value)) {
      lines.push(
        <span key={`${path}-array-open`}>
          {indentation}
          {keyPart}
          [
          <br />
        </span>
      )

      value.forEach((item, index) => {
        lines.push(
          ...renderValue(item as JsonValue, indent + 1, {
            isLast: index === value.length - 1,
            path: `${path}-${index}`,
          })
        )
      })

      const closingBreak = indent > 0 || Boolean(keyLabel)
      lines.push(
        <span key={`${path}-array-close`}>
          {indentation}]{comma}
          {closingBreak ? <br /> : null}
        </span>
      )

      return lines
    }

    if (value !== null && typeof value === "object") {
      lines.push(
        <span key={`${path}-object-open`}>
          {indentation}
          {keyPart}
          {"{"}
          <br />
        </span>
      )

      const entries = Object.entries(value)
      entries.forEach(([childKey, childValue], index) => {
        lines.push(
          ...renderValue(childValue as JsonValue, indent + 1, {
            keyLabel: childKey,
            isLast: index === entries.length - 1,
            path: `${path}-${childKey}`,
          })
        )
      })

      const closingBreak = indent > 0 || Boolean(keyLabel)
      lines.push(
        <span key={`${path}-object-close`}>
          {indentation}{"}"}
          {comma}
          {closingBreak ? <br /> : null}
        </span>
      )

      return lines
    }

    const { renderedValue, color } = renderPrimitive(value)
    lines.push(
      <span key={`${path}-primitive`}>
        {indentation}
        {keyPart}
        <span style={{ color }}>{renderedValue}</span>
        {comma}
        <br />
      </span>
    )

    return lines
  }

  const renderPrimitive = (value: Primitive): { renderedValue: string; color: string } => {
    if (typeof value === "string") {
      return { renderedValue: `"${value}"`, color: theme.tokenColors.string }
    }

    if (typeof value === "number") {
      return { renderedValue: String(value), color: theme.tokenColors.number }
    }

    if (typeof value === "boolean") {
      return { renderedValue: String(value), color: theme.tokenColors.keyword }
    }

    return { renderedValue: "null", color: theme.tokenColors.keyword }
  }

  return <>{renderValue(value as JsonValue, indent, { isLast: true, path: "root" })}</>
}

