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
