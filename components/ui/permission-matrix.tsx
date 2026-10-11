"use client"

import * as React from "react"
import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type PermissionRole = {
  id: string
  label: string
  description?: string
  /** Column can be viewed but not changed. */
  readOnly?: boolean
}

type PermissionItem = {
  id: string
  label: string
  description?: string
}

type PermissionGroup = {
  label: string
  items: PermissionItem[]
}

/** Map of role id to the permission ids it holds. */
type PermissionValue = Record<string, string[]>

type PermissionMatrixLabels = {
  permission: string
  allRoles: string
  readOnly: string
  /** `{permission}` and `{role}` are replaced. */
  cell: string
  /** `{role}` is replaced. */
  selectRole: string
  /** `{permission}` is replaced. */
  selectRow: string
  /** `{group}` and `{role}` are replaced. */
  selectGroup: string
  noChanges: string
  /** `{added}` and `{removed}` are replaced. */
  summary: string
  /** `{more}` is replaced. */
  moreChanges: string
  granted: string
  revoked: string
  reset: string
  empty: string
}

const DEFAULT_LABELS: PermissionMatrixLabels = {
  permission: "Permission",
  allRoles: "All",
  readOnly: "Read-only",
  cell: "{permission} for {role}",
  selectRole: "Select all permissions for {role}",
  selectRow: "Grant {permission} to all roles",
  selectGroup: "All {group} permissions for {role}",
  noChanges: "No changes",
  summary: "{added} granted, {removed} revoked",
  moreChanges: "and {more} more",
  granted: "Granted",
  revoked: "Revoked",
  reset: "Reset",
  empty: "No permissions to show.",
}

const SAMPLE_PERMISSION_ROLES: PermissionRole[] = [
  { id: "admin", label: "Admin", readOnly: true },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
]

const SAMPLE_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Records",
    items: [
      { id: "records.view", label: "View records" },
      { id: "records.edit", label: "Edit records" },
      { id: "records.delete", label: "Delete records" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "settings.view", label: "View settings" },
      { id: "settings.manage", label: "Manage settings" },
    ],
  },
]

const SAMPLE_PERMISSION_VALUE: PermissionValue = {
  admin: [
    "records.view",
    "records.edit",
    "records.delete",
    "settings.view",
    "settings.manage",
  ],
  editor: ["records.view", "records.edit", "settings.view"],
  viewer: ["records.view"],
}

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m
  )
}

type PermissionMatrixProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  roles?: PermissionRole[]
  groups?: PermissionGroup[]
  value?: PermissionValue
  defaultValue?: PermissionValue
  onValueChange?: (value: PermissionValue) => void
  /** Saved state to compare against. Defaults to the value on mount. */
  baseline?: PermissionValue
  /** Disable every cell. */
  readOnly?: boolean
  /** Show the change summary below the grid. */
  showSummary?: boolean
  /** Accessible name for the grid. */
  "aria-label"?: string
  labels?: Partial<PermissionMatrixLabels>
}

type Row =
  | { kind: "group"; key: string; group: PermissionGroup }
  | { kind: "item"; key: string; item: PermissionItem; group: PermissionGroup }

function PermissionMatrix({
  className,
  roles = SAMPLE_PERMISSION_ROLES,
  groups = SAMPLE_PERMISSION_GROUPS,
  value,
  defaultValue = SAMPLE_PERMISSION_VALUE,
  onValueChange,
  baseline,
  readOnly = false,
  showSummary = true,
  labels,
  "aria-label": ariaLabel = "Permissions by role",
  ...props
}: PermissionMatrixProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [internal, setInternal] = React.useState<PermissionValue>(defaultValue)
  const [initial] = React.useState<PermissionValue>(value ?? defaultValue)
  const current = value ?? internal
  const base = baseline ?? initial
  const [pos, setPos] = React.useState({ r: 1, c: 0 })
  const gridRef = React.useRef<HTMLTableElement>(null)

  const rows = React.useMemo<Row[]>(
    () =>
      groups.flatMap((group, gi) => [
        { kind: "group" as const, key: `g${gi}`, group },
        ...group.items.map((item) => ({
          kind: "item" as const,
          key: `i${gi}-${item.id}`,
          item,
          group,
        })),
      ]),
    [groups]
  )
  const editable = roles.filter((r) => !r.readOnly)
  const allIds = groups.flatMap((g) => g.items.map((i) => i.id))
  const allCol = roles.length // index of the "all roles" column

  const has = (map: PermissionValue, role: string, perm: string) =>
    !!map[role]?.includes(perm)

  const stateOf = (
    roleIds: string[],
    permIds: string[],
    map: PermissionValue = current
  ): boolean | "indeterminate" => {
    let on = 0
    let total = 0
    for (const r of roleIds)
      for (const p of permIds) {
        total++
        if (has(map, r, p)) on++
      }
    if (total === 0 || on === 0) return false
    return on === total ? true : "indeterminate"
  }

  const apply = (roleIds: string[], permIds: string[], on: boolean) => {
    if (readOnly) return
    const next: PermissionValue = { ...current }
    for (const r of roleIds) {
      if (roles.find((x) => x.id === r)?.readOnly) continue
      const set = new Set(next[r] ?? [])
      for (const p of permIds) {
        if (on) set.add(p)
        else set.delete(p)
      }
      next[r] = allIds
        .filter((id) => set.has(id))
        .concat([...set].filter((id) => !allIds.includes(id)))
    }
    setInternal(next)
    onValueChange?.(next)
  }

  const toggle = (
    roleIds: string[],
    permIds: string[],
    state: boolean | "indeterminate"
  ) => apply(roleIds, permIds, state !== true)

  const changes = React.useMemo(() => {
    const out: { role: string; perm: string; on: boolean }[] = []
    for (const role of roles)
      for (const g of groups)
        for (const item of g.items) {
          const was = has(base, role.id, item.id)
          const now = has(current, role.id, item.id)
          if (was !== now)
            out.push({
              role: role.label,
              perm: item.label,
              on: now,
            })
        }
    return out
  }, [roles, groups, base, current])
  const added = changes.filter((c) => c.on).length
  const removed = changes.length - added

  const onKeyDown = (e: React.KeyboardEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]")
    if (!target) return
    const [r0, c0] = target.dataset.cell!.split(":").map(Number)
    const step: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    let dr = 0
    let dc = 0
    if (e.key in step) [dr, dc] = step[e.key]
    else if (e.key === "Home" || e.key === "End") {
      const to = e.key === "Home" ? 0 : allCol
      for (let c = to; c !== c0; c += to > c0 ? -1 : 1) {
        const el = gridRef.current?.querySelector<HTMLElement>(
          `[data-cell="${r0}:${c}"]`
        )
        if (el) {
          e.preventDefault()
          el.focus()
          return
        }
      }
      return
    } else return
    e.preventDefault()
    let r = r0 + dr
    let c = c0 + dc
    while (r >= 0 && r <= rows.length && c >= 0 && c <= allCol) {
      const el = gridRef.current?.querySelector<HTMLElement>(
        `[data-cell="${r}:${c}"]`
      )
      if (el) {
        el.focus()
        return
      }
      r += dr
      c += dc
    }
  }

  const cellProps = (r: number, c: number) => ({
    "data-cell": `${r}:${c}`,
    tabIndex: pos.r === r && pos.c === c ? 0 : -1,
    onFocus: () => setPos({ r, c }),
  })

  const sticky = "sticky left-0 z-10 bg-background"

  if (rows.length === 0 || roles.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground"
        data-slot="permission-matrix"
      >
        {l.empty}
      </p>
    )
  }

  return (
    <div
      data-slot="permission-matrix"
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...props}
    >
      <div
        data-slot="permission-matrix-scroll"
        className="max-h-[32rem] overflow-auto rounded-md border"
      >
        <table
          ref={gridRef}
          role="grid"
          aria-label={ariaLabel}
          aria-readonly={readOnly || undefined}
          onKeyDown={onKeyDown}
          className="w-full min-w-max border-separate border-spacing-0 text-sm"
        >
          <thead>
            <tr role="row">
              <th
                scope="col"
                className={cn(
                  sticky,
                  "top-0 z-20 min-w-48 border-b px-3 py-2 text-left"
                )}
              >
                <span className="eyebrow">{l.permission}</span>
              </th>
              {roles.map((role, ci) => {
                const st = stateOf([role.id], allIds)
                return (
                  <th
                    key={role.id}
                    scope="col"
                    className="sticky top-0 z-10 min-w-28 border-b bg-background px-3 py-2 text-center align-bottom"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-sm font-medium">{role.label}</span>
                      {role.readOnly ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[calc(10px*var(--text-scale))] text-muted-foreground uppercase">
                          <Lock aria-hidden className="size-3" />
                          {l.readOnly}
                        </span>
                      ) : (
                        <Checkbox
                          {...cellProps(0, ci)}
                          checked={st}
                          disabled={readOnly}
                          aria-label={fill(l.selectRole, { role: role.label })}
                          onCheckedChange={() => toggle([role.id], allIds, st)}
                        />
                      )}
                    </div>
                  </th>
                )
              })}
              <th
                scope="col"
                className="sticky top-0 z-10 min-w-20 border-b border-l bg-background px-3 py-2 text-center align-bottom"
              >
                <span className="eyebrow">{l.allRoles}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const r = ri + 1
              const permIds =
                row.kind === "group"
                  ? row.group.items.map((i) => i.id)
                  : [row.item.id]
              const isGroup = row.kind === "group"
              const rowState = stateOf(
                editable.map((x) => x.id),
                permIds
              )
              return (
                <tr
                  key={row.key}
                  role="row"
                  data-kind={row.kind}
                  className={cn(isGroup && "bg-muted/50")}
                >
                  <th
                    scope="row"
                    className={cn(
                      sticky,
                      "border-b px-3 py-2 text-left font-normal",
                      isGroup && "bg-muted",
                      !isGroup && "pl-6"
                    )}
                  >
                    {isGroup ? (
                      <span className="eyebrow">{row.group.label}</span>
                    ) : (
                      <span className="flex flex-col">
                        <span>{row.item.label}</span>
                        {row.item.description && (
                          <span className="text-xs text-muted-foreground">
                            {row.item.description}
                          </span>
                        )}
                      </span>
                    )}
                  </th>
                  {roles.map((role, ci) => {
                    const st = stateOf([role.id], permIds)
                    const changed = stateOf([role.id], permIds, base) !== st
                    const locked = readOnly || role.readOnly
                    return (
                      <td
                        key={role.id}
                        role="gridcell"
                        data-changed={changed || undefined}
                        className={cn(
                          "border-b px-3 py-2 text-center",
                          changed && "bg-brand/10"
                        )}
                      >
                        <Checkbox
                          {...cellProps(r, ci)}
                          checked={st}
                          aria-readonly={locked || undefined}
                          aria-label={
                            isGroup
                              ? fill(l.selectGroup, {
                                  group: row.group.label,
                                  role: role.label,
                                })
                              : fill(l.cell, {
                                  permission: row.item.label,
                                  role: role.label,
                                })
                          }
                          className={cn(role.readOnly && "opacity-60")}
                          onCheckedChange={() => {
                            if (!locked) toggle([role.id], permIds, st)
                          }}
                        />
                      </td>
                    )
                  })}
                  <td
                    role="gridcell"
                    className="border-b border-l px-3 py-2 text-center"
                  >
                    {editable.length > 0 && (
                      <Checkbox
                        {...cellProps(r, allCol)}
                        checked={rowState}
                        disabled={readOnly}
                        aria-label={fill(l.selectRow, {
                          permission: isGroup
                            ? row.group.label
                            : row.item.label,
                        })}
                        onCheckedChange={() =>
                          toggle(
                            editable.map((x) => x.id),
                            permIds,
                            rowState
                          )
                        }
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showSummary && (
        <div
          data-slot="permission-matrix-summary"
          className="flex flex-col gap-2 text-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="font-mono text-xs">
              {changes.length === 0
                ? l.noChanges
                : fill(l.summary, { added, removed })}
            </p>
            {changes.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={readOnly}
                onClick={() => {
                  setInternal(base)
                  onValueChange?.(base)
                }}
              >
                {l.reset}
              </Button>
            )}
          </div>
          {changes.length > 0 && (
            <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
              {changes.slice(0, 5).map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-16 shrink-0 font-mono uppercase">
                    {c.on ? `+ ${l.granted}` : `− ${l.revoked}`}
                  </span>
                  <span className="text-foreground">{c.perm}</span>
                  <span>{c.role}</span>
                </li>
              ))}
              {changes.length > 5 && (
                <li>{fill(l.moreChanges, { more: changes.length - 5 })}</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export {
  PermissionMatrix,
  SAMPLE_PERMISSION_ROLES,
  SAMPLE_PERMISSION_GROUPS,
  SAMPLE_PERMISSION_VALUE,
}
export type {
  PermissionMatrixProps,
  PermissionMatrixLabels,
  PermissionRole,
  PermissionItem,
  PermissionGroup,
  PermissionValue,
}
