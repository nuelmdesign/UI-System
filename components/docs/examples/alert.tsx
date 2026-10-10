"use client"

import * as React from "react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert>
        <AlertTitle>Shipment SH-20418 updated</AlertTitle>
        <AlertDescription>
          Departure rescheduled to 06:40 from the Rotterdam hub.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The tracking API is read-only on Sunday, 02:00 to 04:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Customs cleared</AlertTitle>
        <AlertDescription>
          Container MSKU-7731905 is released for pickup.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Weather delay at LHR</AlertTitle>
        <AlertDescription>
          Crosswinds are causing 45 minute holds on departures.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            View affected flights
          </Button>
        </AlertAction>
      </Alert>
      {open && (
        <Alert
          variant="destructive"
          dismissible
          onDismiss={() => setOpen(false)}
        >
          <AlertTitle>Webhook delivery failing</AlertTitle>
          <AlertDescription>
            Endpoint returned 503 for the last 12 attempts.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Retry now
            </Button>
          </AlertAction>
        </Alert>
      )}
      <Alert variant="warning" banner>
        <AlertTitle>Policy update</AlertTitle>
        <AlertDescription>
          New cargo declaration rules apply from 1 November.
        </AlertDescription>
      </Alert>
    </div>
  )
}
