# Permission Matrix

Roles by permissions grid with groups, select-all, indeterminate states, read-only roles and a change summary.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/permission-matrix
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PermissionMatrix } from "@/components/ui/permission-matrix"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/checkbox`, `@opendraft/button`

## Props and types

```ts
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
```

## Example

```tsx
"use client"

import {
  PermissionMatrix,
  type PermissionGroup,
  type PermissionRole,
  type PermissionValue,
} from "@/components/ui/permission-matrix"

const FLEET_ROLES: PermissionRole[] = [
  { id: "owner", label: "Owner", readOnly: true },
  { id: "dispatcher", label: "Dispatcher" },
  { id: "driver", label: "Driver" },
  { id: "auditor", label: "Auditor" },
]
const FLEET_GROUPS: PermissionGroup[] = [
  {
    label: "Shipments",
    items: [
      { id: "ship.view", label: "View shipments" },
      {
        id: "ship.assign",
        label: "Assign drivers",
        description: "Dispatch only",
      },
      { id: "ship.cancel", label: "Cancel shipments" },
    ],
  },
  {
    label: "Vehicles",
    items: [
      { id: "veh.view", label: "View vehicles" },
      { id: "veh.service", label: "Log service" },
    ],
  },
]
const FLEET_VALUE: PermissionValue = {
  owner: ["ship.view", "ship.assign", "ship.cancel", "veh.view", "veh.service"],
  dispatcher: ["ship.view", "ship.assign", "veh.view"],
  driver: ["ship.view", "veh.view", "veh.service"],
  auditor: ["ship.view", "veh.view"],
}

const HR_ROLES: PermissionRole[] = [
  { id: "hr", label: "HR partner" },
  { id: "manager", label: "Manager" },
  { id: "employee", label: "Employee" },
]
const HR_GROUPS: PermissionGroup[] = [
  {
    label: "Compensation",
    items: [
      { id: "pay.view", label: "View salary bands" },
      { id: "pay.edit", label: "Adjust salary" },
    ],
  },
  {
    label: "Time off",
    items: [
      { id: "leave.request", label: "Request leave" },
      { id: "leave.approve", label: "Approve leave" },
    ],
  },
]

export default function PermissionMatrixDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <PermissionMatrix
        aria-label="Fleet permissions"
        roles={FLEET_ROLES}
        groups={FLEET_GROUPS}
        defaultValue={FLEET_VALUE}
      />
      <PermissionMatrix
        aria-label="HR permissions"
        roles={HR_ROLES}
        groups={HR_GROUPS}
        defaultValue={{
          hr: ["pay.view", "pay.edit", "leave.approve"],
          manager: ["leave.request", "leave.approve"],
          employee: ["leave.request"],
        }}
        labels={{
          permission: "Capability",
          summary: "{added} added, {removed} removed",
        }}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/permission-matrix. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
