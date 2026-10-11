"use client"

import * as React from "react"
import { MessageSquarePlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

type ChecklistItem = {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  /** Initial state when the list is uncontrolled and `defaultValue` is not set. */
  done?: boolean
  /** Initial note. */
  note?: string
}

type ChecklistLabels = {
  /** Progress caption. */
  progress: string
  /** Progress value. `{done}` and `{total}` are replaced. */
  count: string
  addNote: string
  editNote: string
  notePlaceholder: string
  noteLabel: string
  signOff: string
  signedOff: string
  /** Shown beside the disabled sign-off button. */
  incomplete: string
  /** Screen-reader announcement when progress changes. */
  announce: string
  empty: string
}

const defaultLabels: ChecklistLabels = {
  progress: "Progress",
  count: "{done} of {total}",
  addNote: "Add note",
  editNote: "Edit note",
  notePlaceholder: "Add a note",
  noteLabel: "Note for",
  signOff: "Sign off",
  signedOff: "Signed off",
  incomplete: "Complete every item to sign off.",
  announce: "{done} of {total} items complete",
  empty: "Nothing to check.",
}

const SAMPLE_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "item-1", label: "Item 1", description: "Short description." },
  { id: "item-2", label: "Item 2" },
  { id: "item-3", label: "Item 3", description: "Short description." },
  { id: "item-4", label: "Item 4" },
]

type ChecklistProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  items?: ChecklistItem[]
  /** Controlled list of completed item ids. */
  value?: string[]
  /** Uncontrolled initial completed ids. Falls back to each item's `done`. */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  title?: React.ReactNode
  description?: React.ReactNode
  /** Show a progress bar and count. */
  showProgress?: boolean
  /** Allow a note on each item. */
  notes?: boolean
  /** Controlled notes keyed by item id. */
  noteValues?: Record<string, string>
  onNoteChange?: (id: string, note: string) => void
  /** Show a sign-off footer. Enabled once every item is done. */
  onComplete?: (result: {
    done: string[]
    notes: Record<string, string>
  }) => void
  /** Extra content above the sign-off button, e.g. a name field. */
  signOff?: React.ReactNode
  /** Disables sign-off even when complete (e.g. a required field is empty). */
  signOffDisabled?: boolean
  disabled?: boolean
  /** Items stay visible and notes readable, but nothing can change. */
  readOnly?: boolean
  labels?: Partial<ChecklistLabels>
}

function fill(template: string, done: number, total: number) {
  return template
    .replace("{done}", String(done))
    .replace("{total}", String(total))
}

function Checklist({
  items = SAMPLE_CHECKLIST_ITEMS,
  value,
  defaultValue,
  onValueChange,
  title,
  description,
  showProgress = true,
  notes = false,
  noteValues,
  onNoteChange,
  onComplete,
  signOff,
  signOffDisabled = false,
  disabled = false,
  readOnly = false,
  labels,
  className,
  ...props
}: ChecklistProps) {
  const l = { ...defaultLabels, ...labels }
  const baseId = React.useId()

  const [innerDone, setInnerDone] = React.useState<string[]>(
    () => defaultValue ?? items.filter((i) => i.done).map((i) => i.id)
  )
  const [innerNotes, setInnerNotes] = React.useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        items.filter((i) => i.note).map((i) => [i.id, i.note as string])
      )
  )
  const [open, setOpen] = React.useState<Record<string, boolean>>({})
  const [signed, setSigned] = React.useState(false)

  const done = value ?? innerDone
  const noteMap = noteValues ?? innerNotes
  const doneSet = new Set(done)
  const total = items.length
  const count = items.filter((i) => doneSet.has(i.id)).length
  const complete = total > 0 && count === total
  const locked = disabled || readOnly

  function toggle(id: string, checked: boolean) {
    const next = checked
      ? [...done.filter((d) => d !== id), id]
      : done.filter((d) => d !== id)
    if (value === undefined) setInnerDone(next)
    onValueChange?.(next)
    setSigned(false)
  }

  function setNote(id: string, note: string) {
    if (noteValues === undefined) setInnerNotes((n) => ({ ...n, [id]: note }))
    onNoteChange?.(id, note)
  }

  return (
    <div
      data-slot="checklist"
      data-complete={complete || undefined}
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && (
            <h3 data-slot="checklist-title" className="heading text-xl">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {showProgress && (
        <Progress
          data-slot="checklist-progress"
          label={l.progress}
          valueLabel={fill(l.count, count, total)}
          value={count}
          max={Math.max(total, 1)}
          tone={complete ? "success" : "brand"}
        />
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {fill(l.announce, count, total)}
      </span>

      {total === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          {l.empty}
        </p>
      ) : (
        <ul
          data-slot="checklist-items"
          className="divide-y rounded-lg border bg-card"
        >
          {items.map((item) => {
            const checked = doneSet.has(item.id)
            const id = `${baseId}-${item.id}`
            const note = noteMap[item.id] ?? ""
            const showNote = notes && (open[item.id] || (readOnly && note))
            return (
              <li
                key={item.id}
                data-slot="checklist-item"
                data-state={checked ? "done" : "todo"}
                className="flex flex-col gap-2 p-3"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={id}
                    checked={checked}
                    disabled={disabled}
                    aria-readonly={readOnly || undefined}
                    aria-describedby={
                      item.description ? `${id}-desc` : undefined
                    }
                    onCheckedChange={(c) => {
                      if (!locked) toggle(item.id, c === true)
                    }}
                    className="mt-0.5"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <label
                      htmlFor={id}
                      className={cn(
                        "text-sm font-medium",
                        checked && "text-muted-foreground line-through",
                        locked ? "cursor-default" : "cursor-pointer"
                      )}
                    >
                      {item.label}
                    </label>
                    {item.description && (
                      <p
                        id={`${id}-desc`}
                        className="text-xs text-muted-foreground"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  {notes && !readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={disabled}
                      aria-expanded={!!open[item.id]}
                      aria-controls={`${id}-note`}
                      onClick={() =>
                        setOpen((o) => ({ ...o, [item.id]: !o[item.id] }))
                      }
                    >
                      <MessageSquarePlus aria-hidden />
                      {note ? l.editNote : l.addNote}
                    </Button>
                  )}
                </div>
                {showNote &&
                  (readOnly ? (
                    <p
                      id={`${id}-note`}
                      className="ml-7 border-l pl-3 text-sm text-muted-foreground"
                    >
                      {note}
                    </p>
                  ) : (
                    <Textarea
                      id={`${id}-note`}
                      value={note}
                      disabled={disabled}
                      placeholder={l.notePlaceholder}
                      aria-label={`${l.noteLabel} ${typeof item.label === "string" ? item.label : item.id}`}
                      onChange={(e) => setNote(item.id, e.target.value)}
                      className="ml-7 min-h-16 w-auto"
                    />
                  ))}
              </li>
            )
          })}
        </ul>
      )}

      {onComplete && (
        <div
          data-slot="checklist-signoff"
          className="flex flex-col gap-3 rounded-lg border bg-surface p-3"
        >
          {signOff}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {signed ? l.signedOff : complete ? "" : l.incomplete}
            </p>
            <Button
              type="button"
              variant="ink"
              disabled={!complete || locked || signOffDisabled || signed}
              onClick={() => {
                setSigned(true)
                onComplete({ done, notes: noteMap })
              }}
            >
              {signed ? l.signedOff : l.signOff}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Checklist, SAMPLE_CHECKLIST_ITEMS }
export type { ChecklistItem, ChecklistLabels, ChecklistProps }
