"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="mt-0.5 size-8 shrink-0">
        <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1.5">
        <span className="px-1 text-[11px] font-medium text-muted-foreground">
          Analysis Assistant
        </span>
        <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-chat-bubble-ai px-4 py-3">
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
