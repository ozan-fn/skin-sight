"use client"

import { Sparkles, History, Settings, Plus, MessageSquare, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Conversation {
  id: string
  title: string
  preview: string
  date: string
  active?: boolean
}

const conversations: Conversation[] = [
  {
    id: "1",
    title: "Q4 Revenue Analysis",
    preview: "Show me the revenue breakdown by region...",
    date: "Today",
    active: true,
  },
  {
    id: "2",
    title: "Server Performance",
    preview: "What endpoints are causing the highest error rates?",
    date: "Today",
  },
  {
    id: "3",
    title: "User Retention Metrics",
    preview: "Analyze cohort retention for the last 6 months...",
    date: "Yesterday",
  },
  {
    id: "4",
    title: "Marketing Campaign ROI",
    preview: "Compare the ROI across Q3 campaigns...",
    date: "Yesterday",
  },
  {
    id: "5",
    title: "Database Optimization",
    preview: "Identify the slowest queries in production...",
    date: "3 days ago",
  },
  {
    id: "6",
    title: "Customer Churn Prediction",
    preview: "Which segments have the highest risk...",
    date: "Last week",
  },
]

interface ChatSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function ChatSidebar({ collapsed, onToggle }: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Sparkles className="size-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-sidebar-foreground">
              Analysis Assistant
            </h1>
            <p className="text-[11px] text-muted-foreground">AI-powered insights</p>
          </div>
        )}
      </div>

      {/* New chat button */}
      <div className="shrink-0 p-3">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-full border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                <Plus className="size-4" />
                <span className="sr-only">New chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New chat</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Search (only when expanded) */}
      {!collapsed && (
        <div className="shrink-0 px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2.5 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {collapsed ? (
            conversations.map((conv) => (
              <Tooltip key={conv.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg transition-colors",
                      conv.active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <MessageSquare className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{conv.title}</TooltipContent>
              </Tooltip>
            ))
          ) : (
            <>
              {["Today", "Yesterday", "Previous"].map((group) => {
                const groupConvs = conversations.filter((c) => {
                  if (group === "Today") return c.date === "Today"
                  if (group === "Yesterday") return c.date === "Yesterday"
                  return c.date !== "Today" && c.date !== "Yesterday"
                })
                if (groupConvs.length === 0) return null
                return (
                  <div key={group} className="mb-2">
                    <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                      {group}
                    </p>
                    {groupConvs.map((conv) => (
                      <button
                        key={conv.id}
                        className={cn(
                          "flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                          conv.active
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <span className="w-full truncate text-xs font-medium">
                          {conv.title}
                        </span>
                        <span className="w-full truncate text-[11px] text-muted-foreground/60">
                          {conv.preview}
                        </span>
                      </button>
                    ))}
                  </div>
                )
              })}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-border p-2">
        <div className={cn("flex", collapsed ? "flex-col items-center gap-1" : "gap-1")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-sidebar-foreground"
              >
                <History className="size-4" />
                <span className="sr-only">History</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"}>History</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-sidebar-foreground"
              >
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"}>Settings</TooltipContent>
          </Tooltip>
          <div className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="size-9 text-muted-foreground hover:text-sidebar-foreground"
              >
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    collapsed ? "-rotate-90" : "rotate-90"
                  )}
                />
                <span className="sr-only">
                  {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"}>
              {collapsed ? "Expand" : "Collapse"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  )
}
