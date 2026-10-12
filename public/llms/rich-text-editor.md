# Rich Text Editor

Accessible Tiptap editor with a roving toolbar, validated links, character limit and a read-only renderer, for notes, case files and messages.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/rich-text-editor
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { RichTextEditor, RichTextContent } from "@/components/ui/rich-text-editor"
```

## Dependencies

- npm: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/input`, `@opendraft/popover`, `@opendraft/tooltip`

## Props and types

```ts
type ToolbarItem =
  | "heading2"
  | "heading3"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "link"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "undo"
  | "redo"

type RichTextEditorLabels = {
  toolbar: string
  heading2: string
  heading3: string
  bold: string
  italic: string
  underline: string
  strike: string
  code: string
  link: string
  bulletList: string
  orderedList: string
  blockquote: string
  undo: string
  redo: string
  linkUrl: string
  linkPlaceholder: string
  linkApply: string
  linkRemove: string
  linkInvalid: string
  /** `{count}` is replaced. */
  count: string
  /** `{count}` and `{max}` are replaced. */
  countOfMax: string
  /** `{over}` is replaced. */
  overLimit: string
  submitHint: string
  placeholder: string
}

type RichTextContentProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * HTML to render. It is injected as markup, so it MUST be sanitized on the
   * server first (allow-list tags and http/https/mailto URLs). Never pass
   * unsanitized user input.
   */
  html: string
}

type RichTextEditorProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "onSubmit" | "defaultValue" | "children"
> & {
  /** Controlled content: an HTML string, or Tiptap JSON when `format="json"`. */
  value?: string | JSONContent
  defaultValue?: string | JSONContent
  /** How `value` / `defaultValue` are expressed. Default "html". */
  format?: "html" | "json"
  /** Called on every edit with both representations. HTML is "" when empty. */
  onChange?: (html: string, json: JSONContent) => void
  /** Called on Ctrl/Cmd + Enter. */
  onSubmit?: (html: string, json: JSONContent) => void
  placeholder?: string
  readOnly?: boolean
  disabled?: boolean
  invalid?: boolean
  /** Minimum height of the writing area, any CSS length. Default 8rem. */
  minHeight?: string | number
  /** Soft limit on characters: typing past it is blocked, pastes show over. */
  maxLength?: number
  /** Which toolbar buttons to show, in order. Default is all. */
  toolbar?: ToolbarItem[]
  /** Hide the character count. */
  hideCount?: boolean
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  labels?: Partial<RichTextEditorLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  RichTextContent,
  RichTextEditor,
} from "@/components/ui/rich-text-editor"

const NOTE_SEED =
  "<h2>Site visit, unit 4B</h2><p>Tenant reports a <strong>recurring leak</strong> under the kitchen sink. Moisture reading was elevated near the wall.</p><ul><li>Photograph the pipe joint</li><li>Book plumber for Thursday</li></ul>"

const LESSON_SEED =
  "<p>In this lesson you will learn how to read a simple balance sheet and spot the three numbers that matter most.</p>"

export default function RichTextEditorDemo() {
  const [notes, setNotes] = React.useState<{ id: number; html: string }[]>([])
  const [draft, setDraft] = React.useState(NOTE_SEED)
  const [lesson, setLesson] = React.useState(LESSON_SEED)
  const nextId = React.useRef(1)

  function submit(html: string) {
    if (!html) return
    setNotes((n) => [{ id: nextId.current++, html }, ...n])
    setDraft("")
  }

  return (
    <div className="grid w-full max-w-5xl gap-10 @3xl:grid-cols-2">
      <section className="flex min-w-0 flex-col gap-3">
        <p className="eyebrow">Case file</p>
        <Label id="case-note-label">Add a note to this case</Label>
        <RichTextEditor
          aria-labelledby="case-note-label"
          value={draft}
          onChange={(html) => setDraft(html)}
          onSubmit={submit}
          placeholder="Record what happened, what was said, what comes next…"
          toolbar={[
            "bold",
            "italic",
            "link",
            "bulletList",
            "orderedList",
            "blockquote",
            "undo",
            "redo",
          ]}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={() => submit(draft)} disabled={!draft}>
            Add note
          </Button>
        </div>
        <ul className="flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-md border p-3">
              {/* Demo only: in a real app, sanitize on the server first. */}
              <RichTextContent html={n.html} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-w-0 flex-col gap-3">
        <p className="eyebrow">Course lesson</p>
        <Label id="lesson-label">Lesson description</Label>
        <RichTextEditor
          aria-labelledby="lesson-label"
          value={lesson}
          onChange={(html) => setLesson(html)}
          maxLength={280}
          minHeight="10rem"
          placeholder="Describe what learners will cover…"
          toolbar={[
            "heading2",
            "heading3",
            "bold",
            "italic",
            "underline",
            "link",
            "bulletList",
            "orderedList",
            "undo",
            "redo",
          ]}
          labels={{
            count: "{count} characters",
            countOfMax: "{count} of {max}",
          }}
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/rich-text-editor. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
