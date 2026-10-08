// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
"use client"

import { createContext } from "react"

export type MessageSide = "start" | "end"

export const MessageSideContext = createContext<MessageSide | undefined>(
  undefined
)
