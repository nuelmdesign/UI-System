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
