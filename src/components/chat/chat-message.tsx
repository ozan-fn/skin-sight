"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImageAttachment {
  id: string;
  url: string;
  name: string;
}

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  images?: ImageAttachment[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <Avatar className="mt-0.5 size-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            isUser
              ? "bg-chat-bubble-user/20 text-chat-bubble-user"
              : "bg-primary/15 text-primary",
          )}
        >
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1.5",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Role label */}
        <span className="px-1 text-[11px] font-medium text-muted-foreground">
          {isUser ? "You" : "Analysis Assistant"}
        </span>

        {/* Image attachments */}
        {message.images && message.images.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-2",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            {message.images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg border border-border"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-40 max-w-60 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent px-2 py-1">
                  <span className="text-[10px] text-foreground/80 truncate block">
                    {img.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text bubble */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              isUser
                ? "bg-chat-bubble-user text-chat-foreground rounded-br-md"
                : "bg-chat-bubble-ai text-chat-foreground rounded-bl-md",
            )}
          >
            {message.content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < message.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="px-1 text-[10px] text-muted-foreground/70">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

/* Image preview thumbnail in the input area */
interface ImagePreviewProps {
  image: ImageAttachment;
  onRemove: (id: string) => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="group relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
      <img
        src={image.url}
        alt={image.name}
        className="size-full object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(image.id)}
        className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-background/90 text-muted-foreground opacity-0 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
      >
        <X className="size-3" />
        <span className="sr-only">Remove image</span>
      </Button>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent px-1 py-0.5">
        <span className="block truncate text-[8px] text-foreground/70">
          {image.name}
        </span>
      </div>
    </div>
  );
}
