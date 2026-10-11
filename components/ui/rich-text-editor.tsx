"use client"

/**
 * RichTextEditor: a token-styled, accessible rich text editor for notes, case
 * files, lesson copy, messages. Built on Tiptap v3 (MIT, https://tiptap.dev),
 * which is the editing engine; the toolbar, link popover and prose styles are
 * opendraft's.
 *
 * SANITIZATION: the editor only produces a constrained set of tags (headings,
 * paragraphs, lists, quotes, code, marks and links with http/https/mailto), but
 * the HTML you store is still untrusted input. Callers MUST sanitize it on the
 * server (allow-list the same tags and URL protocols) before saving it and
 * before rendering it anywhere with `RichTextContent` or
 * `dangerouslySetInnerHTML`. Never trust client-produced HTML.
 */

import * as React from "react"
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
  type JSONContent,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const DEFAULT_TOOLBAR: ToolbarItem[] = [
  "heading2",
  "heading3",
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "link",
  "bulletList",
  "orderedList",
  "blockquote",
  "undo",
  "redo",
]

/** Items in the same group sit together; a hairline divides groups. */
const GROUP: Record<ToolbarItem, number> = {
  heading2: 0,
  heading3: 0,
  bold: 1,
  italic: 1,
  underline: 1,
  strike: 1,
  code: 1,
  link: 2,
  bulletList: 3,
  orderedList: 3,
  blockquote: 3,
  undo: 4,
  redo: 4,
}

const ICONS: Record<ToolbarItem, React.ComponentType> = {
  heading2: Heading2,
  heading3: Heading3,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strikethrough,
  code: Code,
  link: Link2,
  bulletList: List,
  orderedList: ListOrdered,
  blockquote: Quote,
  undo: Undo2,
  redo: Redo2,
}

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

const DEFAULT_LABELS: RichTextEditorLabels = {
  toolbar: "Formatting",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strike: "Strikethrough",
  code: "Code",
  link: "Link",
  bulletList: "Bulleted list",
  orderedList: "Numbered list",
  blockquote: "Quote",
  undo: "Undo",
  redo: "Redo",
  linkUrl: "Link address",
  linkPlaceholder: "https://example.com",
  linkApply: "Apply",
  linkRemove: "Remove link",
  linkInvalid: "Enter an http, https or mailto address.",
  count: "{count} characters",
  countOfMax: "{count} / {max}",
  overLimit: "Over the limit by {over}",
  submitHint: "Ctrl/Cmd + Enter to submit",
  placeholder: "Start writing…",
}

const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"]

/**
 * Returns a normalized URL when `input` is an http, https or mailto address,
 * otherwise null. Bare domains get https://, bare emails get mailto:.
 */
function normalizeLink(input: string): string | null {
  const raw = input.trim()
  if (!raw || /\s/.test(raw)) return null
  let candidate = raw
  if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    candidate = /^[^@/]+@[^@/]+\.[^@/]+$/.test(raw)
      ? `mailto:${raw}`
      : `https://${raw}`
  }
  try {
    const url = new URL(candidate)
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return null
    if (url.protocol !== "mailto:" && !url.hostname.includes(".")) return null
    return candidate
  } catch {
    return null
  }
}

/**
 * Scoped prose styles, tokens only. Shared by the editor and `RichTextContent`
 * so stored content renders exactly as it was written.
 */
const PROSE = cn(
  "text-sm leading-relaxed text-foreground",
  "[&_.ProseMirror]:outline-none",
  "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
  "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:heading [&_h2]:text-xl [&_h2:first-child]:mt-0",
  "[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:heading [&_h3]:text-lg [&_h3:first-child]:mt-0",
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_li]:my-0.5 [&_li::marker]:text-muted-foreground [&_li>p]:my-0",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_s]:opacity-80 [&_strong]:font-semibold",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
)

type RichTextContentProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * HTML to render. It is injected as markup, so it MUST be sanitized on the
   * server first (allow-list tags and http/https/mailto URLs). Never pass
   * unsanitized user input.
   */
  html: string
}

/**
 * Read-only renderer for HTML produced by `RichTextEditor`, with the same prose
 * styles. The HTML must be sanitized first; this component does not do it.
 */
function RichTextContent({ html, className, ...props }: RichTextContentProps) {
  return (
    <div
      data-slot="rich-text-content"
      className={cn(PROSE, className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
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

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    String(values[k] ?? "")
  )
}

type ToolState = {
  active: Partial<Record<ToolbarItem, boolean>>
  canUndo: boolean
  canRedo: boolean
  length: number
  linkHref: string
}

const EMPTY_STATE: ToolState = {
  active: {},
  canUndo: false,
  canRedo: false,
  length: 0,
  linkHref: "",
}

function readState(editor: Editor | null): ToolState {
  if (!editor) return EMPTY_STATE
  return {
    active: {
      heading2: editor.isActive("heading", { level: 2 }),
      heading3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      link: editor.isActive("link"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
    },
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
    length: editor.state.doc.textContent.length,
    linkHref: (editor.getAttributes("link").href as string | undefined) ?? "",
  }
}

function run(editor: Editor, item: ToolbarItem) {
  const chain = editor.chain().focus()
  switch (item) {
    case "heading2":
      return chain.toggleHeading({ level: 2 }).run()
    case "heading3":
      return chain.toggleHeading({ level: 3 }).run()
    case "bold":
      return chain.toggleBold().run()
    case "italic":
      return chain.toggleItalic().run()
    case "underline":
      return chain.toggleUnderline().run()
    case "strike":
      return chain.toggleStrike().run()
    case "code":
      return chain.toggleCode().run()
    case "bulletList":
      return chain.toggleBulletList().run()
    case "orderedList":
      return chain.toggleOrderedList().run()
    case "blockquote":
      return chain.toggleBlockquote().run()
    case "undo":
      return chain.undo().run()
    case "redo":
      return chain.redo().run()
    default:
      return false
  }
}

function RichTextEditor({
  value,
  defaultValue,
  format = "html",
  onChange,
  onSubmit,
  placeholder,
  readOnly = false,
  disabled = false,
  invalid = false,
  minHeight = "8rem",
  maxLength,
  toolbar = DEFAULT_TOOLBAR,
  hideCount = false,
  labels: labelsProp,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RichTextEditorProps) {
  const labels = React.useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const countId = React.useId()
  const editable = !readOnly && !disabled

  // Latest callbacks/limits for editor handlers, which Tiptap holds onto.
  const latest = React.useRef({ onChange, onSubmit, maxLength })
  React.useEffect(() => {
    latest.current = { onChange, onSubmit, maxLength }
  })

  const editorProps = React.useMemo(
    () => ({
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
        "aria-describedby": [ariaDescribedBy, hideCount ? "" : countId]
          .filter(Boolean)
          .join(" "),
        ...(readOnly ? { "aria-readonly": "true" } : {}),
        ...(disabled ? { "aria-disabled": "true" } : {}),
        ...(invalid ? { "aria-invalid": "true" } : {}),
        class: "min-h-(--rte-min-height) px-3 py-2.5",
      },
      handleKeyDown: (
        view: { state: { doc: { textContent: string } } },
        event: KeyboardEvent
      ) => {
        if (
          event.key === "Enter" &&
          (event.metaKey || event.ctrlKey) &&
          latest.current.onSubmit
        ) {
          event.preventDefault()
          const e = editorRef.current
          if (e) latest.current.onSubmit(serialize(e), e.getJSON())
          return true
        }
        return false
      },
      handleTextInput: (view: { state: { doc: { textContent: string } } }) => {
        const max = latest.current.maxLength
        return max != null && view.state.doc.textContent.length >= max
      },
    }),
    [
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      countId,
      hideCount,
      readOnly,
      disabled,
      invalid,
    ]
  )

  const editorRef = React.useRef<Editor | null>(null)

  const initial = value ?? defaultValue ?? ""
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable,
    content: initial,
    extensions: [
      // StarterKit v3 already bundles Link and Underline.
      StarterKit.configure({
        heading: { levels: [2, 3] },
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https", "mailto"],
          isAllowedUri: (url) => normalizeLink(url) !== null,
          HTMLAttributes: { rel: "noopener noreferrer nofollow" },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? labels.placeholder,
      }),
    ],
    editorProps,
    onUpdate: ({ editor: e }) => {
      latest.current.onChange?.(serialize(e), e.getJSON())
    },
  })

  React.useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Controlled value: push external changes in without echoing onChange.
  React.useEffect(() => {
    if (!editor || value === undefined) return
    if (typeof value === "string") {
      const same =
        value === serialize(editor) || (value === "" && editor.isEmpty)
      if (!same) editor.commands.setContent(value, { emitUpdate: false })
    } else if (JSON.stringify(value) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value, format])

  const state =
    useEditorState({
      editor,
      selector: ({ editor: e }) => readState(e),
    }) ?? EMPTY_STATE

  const items = toolbar.filter((i) => i in ICONS)
  const over = maxLength != null ? state.length - maxLength : -1
  const showToolbar = !readOnly && items.length > 0

  return (
    <TooltipProvider>
      <div
        data-slot="rich-text-editor"
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className={cn(
          "flex min-w-0 flex-col rounded-md border border-input bg-background text-sm shadow-xs dark:bg-input/20",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-within:border-brand/60 focus-within:ring-[3px] focus-within:ring-ring",
          "data-[invalid]:border-destructive data-[invalid]:focus-within:ring-destructive/20",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )}
        style={
          {
            "--rte-min-height":
              typeof minHeight === "number" ? `${minHeight}px` : minHeight,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {showToolbar && (
          <Toolbar
            editor={editor}
            items={items}
            labels={labels}
            state={state}
            disabled={!editable}
            hasSubmit={!!onSubmit}
          />
        )}
        <EditorContent
          editor={editor}
          data-slot="rich-text-editor-content"
          className={cn("min-w-0 flex-1", PROSE)}
        />
        {(!hideCount || onSubmit) && !readOnly && (
          <div className="flex items-center justify-between gap-3 border-t px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="truncate">
              {onSubmit ? labels.submitHint : null}
            </span>
            {!hideCount && (
              <span
                id={countId}
                data-over={over > 0 || undefined}
                className="shrink-0 tabular-nums data-[over]:font-medium data-[over]:text-destructive"
              >
                {maxLength != null
                  ? fill(labels.countOfMax, {
                      count: state.length,
                      max: maxLength,
                    })
                  : fill(labels.count, { count: state.length })}
                {over > 0 ? ` · ${fill(labels.overLimit, { over })}` : ""}
              </span>
            )}
          </div>
        )}
        <span role="status" className="sr-only">
          {over > 0 ? fill(labels.overLimit, { over }) : ""}
        </span>
      </div>
    </TooltipProvider>
  )
}

function serialize(editor: Editor) {
  return editor.isEmpty ? "" : editor.getHTML()
}

function Toolbar({
  editor,
  items,
  labels,
  state,
  disabled,
}: {
  editor: Editor | null
  items: ToolbarItem[]
  labels: RichTextEditorLabels
  state: ToolState
  disabled: boolean
  hasSubmit: boolean
}) {
  const [activeId, setActiveId] = React.useState<ToolbarItem | null>(null)

  const enabled = (item: ToolbarItem) =>
    !disabled &&
    !!editor &&
    (item === "undo" ? state.canUndo : item === "redo" ? state.canRedo : true)
  const enabledItems = items.filter(enabled)
  const tabStop =
    activeId && enabledItems.includes(activeId) ? activeId : enabledItems[0]

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    // Ignore events bubbling through portals (the link popover).
    if (!e.currentTarget.contains(target)) return
    const buttons = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        "[data-toolbar-item]:not(:disabled)"
      )
    )
    const index = buttons.indexOf(target.closest("[data-toolbar-item]")!)
    if (index < 0) return
    let next = index
    if (e.key === "ArrowRight") next = (index + 1) % buttons.length
    else if (e.key === "ArrowLeft")
      next = (index - 1 + buttons.length) % buttons.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = buttons.length - 1
    else return
    e.preventDefault()
    buttons[next]?.focus()
  }

  function onFocus(e: React.FocusEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (!e.currentTarget.contains(target)) return
    const id = target.closest<HTMLElement>("[data-toolbar-item]")?.dataset
      .toolbarItem as ToolbarItem | undefined
    if (id) setActiveId(id)
  }

  return (
    <div
      role="toolbar"
      aria-label={labels.toolbar}
      aria-orientation="horizontal"
      data-slot="rich-text-editor-toolbar"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1"
    >
      {items.map((item, i) => {
        const Icon = ICONS[item]
        const label = labels[item]
        const pressed = !!state.active[item]
        const isToggle = item !== "undo" && item !== "redo"
        const divider = i > 0 && GROUP[items[i - 1]] !== GROUP[item]
        const button = (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            data-toolbar-item={item}
            aria-label={label}
            aria-pressed={isToggle ? pressed : undefined}
            disabled={!enabled(item)}
            tabIndex={tabStop === item ? 0 : -1}
            // Keep the editor selection while clicking toolbar buttons.
            onMouseDown={(e) => e.preventDefault()}
            onClick={
              item === "link" ? undefined : () => editor && run(editor, item)
            }
            className={cn(pressed && "bg-accent text-brand hover:bg-accent")}
          >
            <Icon />
          </Button>
        )
        return (
          <React.Fragment key={item}>
            {divider && (
              <span
                role="separator"
                aria-orientation="vertical"
                className="mx-1 h-5 w-px bg-border"
              />
            )}
            {item === "link" ? (
              <LinkControl
                editor={editor}
                labels={labels}
                href={state.linkHref}
                button={button}
                tooltip={label}
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function LinkControl({
  editor,
  labels,
  href,
  button,
  tooltip,
}: {
  editor: Editor | null
  labels: RichTextEditorLabels
  href: string
  button: React.ReactElement
  tooltip: string
}) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [error, setError] = React.useState(false)
  const errorId = React.useId()

  function onOpenChange(next: boolean) {
    if (next) {
      setDraft(href)
      setError(false)
    }
    setOpen(next)
  }

  function apply(e: React.FormEvent) {
    e.preventDefault()
    // The popover is portaled; do not submit a surrounding <form>.
    e.stopPropagation()
    if (!editor) return
    const url = normalizeLink(draft)
    if (!url) {
      setError(true)
      return
    }
    const chain = editor.chain().focus().extendMarkRange("link")
    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain
        .insertContent({
          type: "text",
          text: url,
          marks: [{ type: "link", attrs: { href: url } }],
        })
        .run()
    } else {
      chain.setLink({ href: url }).run()
    }
    setOpen(false)
  }

  function remove() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>{button}</PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80 rounded-md p-3">
        <form onSubmit={apply} className="flex flex-col gap-2" noValidate>
          <Input
            type="text"
            inputMode="url"
            autoComplete="off"
            autoFocus
            value={draft}
            placeholder={labels.linkPlaceholder}
            aria-label={labels.linkUrl}
            aria-invalid={error || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => {
              setDraft(e.target.value)
              setError(false)
            }}
          />
          {error && (
            <p id={errorId} role="alert" className="text-xs text-destructive">
              {labels.linkInvalid}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={!href}
              onClick={remove}
            >
              {labels.linkRemove}
            </Button>
            <Button type="submit" size="xs">
              {labels.linkApply}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export { RichTextEditor, RichTextContent, normalizeLink, DEFAULT_TOOLBAR }
export type {
  RichTextEditorProps,
  RichTextEditorLabels,
  RichTextContentProps,
  ToolbarItem as RichTextToolbarItem,
}
