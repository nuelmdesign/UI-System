// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
"use client"

import { type CSSProperties, Fragment, useEffect, useState } from "react"
import type { HighlighterCore } from "shiki/core"
import { cn } from "@/lib/utils"

export type AgentCodeLanguage =
  "bash" | "diff" | "json" | "text" | "tsx" | "typescript"

export interface AgentCodeToken {
  content: string
  offset: number
  light?: string
  dark?: string
}

export type AgentCodeTokenLines = AgentCodeToken[][]

export interface AgentCodeProps {
  code: string
  language?: AgentCodeLanguage
  className?: string
}

export interface AgentCodeLineProps {
  code: string
  tokens?: AgentCodeToken[]
  className?: string
}

const LIGHT_THEME = "github-light-high-contrast"
const DARK_THEME = "github-dark-high-contrast"
let agentCodeHighlighter: Promise<HighlighterCore> | null = null
const tokenCache = new Map<string, AgentCodeTokenLines>()

// Fine-grained Shiki: only these grammars and themes ship, loaded on first use,
// with the JavaScript regex engine instead of the Oniguruma WASM build.
function getAgentCodeHighlighter() {
  if (!agentCodeHighlighter) {
    agentCodeHighlighter = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
    ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [
          import("shiki/themes/github-light-high-contrast.mjs"),
          import("shiki/themes/github-dark-high-contrast.mjs"),
        ],
        langs: [
          import("shiki/langs/bash.mjs"),
          import("shiki/langs/diff.mjs"),
          import("shiki/langs/json.mjs"),
          import("shiki/langs/tsx.mjs"),
          import("shiki/langs/typescript.mjs"),
        ],
        engine: createJavaScriptRegexEngine(),
      })
    )
  }
  return agentCodeHighlighter
}

function tokenCacheKey(code: string, language: AgentCodeLanguage) {
  return `${language}\u0000${code}`
}

export function useAgentCodeTokens(code: string, language: AgentCodeLanguage) {
  const key = tokenCacheKey(code, language)
  const cached = tokenCache.get(key)
  const [result, setResult] = useState<{
    key: string
    code: string
    language: AgentCodeLanguage
    lines: AgentCodeTokenLines
  } | null>(cached ? { key, code, language, lines: cached } : null)

  useEffect(() => {
    // Cached tokens are returned during render below; nothing to fetch.
    if (tokenCache.has(key)) return

    let cancelled = false
    getAgentCodeHighlighter().then((highlighter) => {
      if (cancelled) return
      const lines = highlighter
        .codeToTokensWithThemes(code, {
          lang: language,
          themes: {
            light: LIGHT_THEME,
            dark: DARK_THEME,
          },
        })
        .map((line) =>
          line.map((token) => ({
            content: token.content,
            offset: token.offset,
            light: token.variants.light?.color,
            dark: token.variants.dark?.color,
          }))
        )
      tokenCache.set(key, lines)
      setResult({ key, code, language, lines })
    })
    return () => {
      cancelled = true
    }
  }, [code, key, language])

  if (cached) return cached
  if (result?.key === key) return result.lines
  if (result?.language === language && code.startsWith(result.code)) {
    return result.lines
  }
  return null
}

/** Splits code into lines, each with its character offset into the whole. */
export function splitCodeLines(code: string) {
  const lines: { content: string; offset: number }[] = []
  let offset = 0
  for (const content of code.split("\n")) {
    lines.push({ content, offset })
    offset += content.length + 1
  }
  return lines
}

export function AgentCodeLine({ code, tokens, className }: AgentCodeLineProps) {
  return (
    <span className={className}>
      {tokens
        ? tokens.map((token) => (
            <span
              key={`${token.offset}-${token.content}`}
              style={
                {
                  "--agent-code-light": token.light ?? "currentColor",
                  "--agent-code-dark":
                    token.dark ?? token.light ?? "currentColor",
                } as CSSProperties
              }
              className="text-[var(--agent-code-light)] dark:text-[var(--agent-code-dark)]"
            >
              {token.content}
            </span>
          ))
        : code}
    </span>
  )
}

export function AgentCode({
  code,
  language = "bash",
  className,
}: AgentCodeProps) {
  const tokens = useAgentCodeTokens(code, language)
  const lines = splitCodeLines(code)

  return (
    <pre
      className={cn(
        "m-0 overflow-x-auto font-mono text-xs leading-5 whitespace-pre text-foreground/85",
        className
      )}
    >
      <code>
        {lines.map((line, index) => (
          <Fragment key={line.offset}>
            <AgentCodeLine code={line.content} tokens={tokens?.[index]} />
            {index < lines.length - 1 ? "\n" : null}
          </Fragment>
        ))}
      </code>
    </pre>
  )
}
