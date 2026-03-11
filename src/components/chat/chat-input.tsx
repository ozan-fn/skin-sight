"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, ImagePlus, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { ImagePreview, type ImageAttachment } from "./chat-message";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  pendingImages: ImageAttachment[];
  onAddImages: (images: ImageAttachment[]) => void;
  onRemoveImage: (id: string) => void;
  isTyping: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSend,
  pendingImages,
  onAddImages,
  onRemoveImage,
  isTyping,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend],
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(e.target.value);
      // Auto-resize
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    },
    [onInputChange],
  );

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newImages: ImageAttachment[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newImages.push({
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            url,
            name: file.name,
          });
        }
      });
      if (newImages.length > 0) {
        onAddImages(newImages);
      }
    },
    [onAddImages],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const canSend = input.trim() || pendingImages.length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-3xl border-t border-border bg-background px-4 py-4">
      {/* Image previews */}
      {pendingImages.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {pendingImages.map((img) => (
            <ImagePreview key={img.id} image={img} onRemove={onRemoveImage} />
          ))}
        </div>
      )}

      {/* Input container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex items-end gap-2 rounded-2xl border border-border bg-secondary/50 px-3 py-2 transition-colors focus-within:border-primary/40 focus-within:bg-secondary/80"
      >
        {/* Attach file */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Attach file</TooltipContent>
        </Tooltip>

        {/* Image upload */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ImagePlus className="size-4" />
              <span className="sr-only">Upload image</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Upload image</TooltipContent>
        </Tooltip>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.csv,.xlsx,.json"
          multiple
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask the Analysis Assistant..."
          rows={1}
          className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Voice (decorative) */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Mic className="size-4" />
              <span className="sr-only">Voice input</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Voice input</TooltipContent>
        </Tooltip> */}

        {/* Send */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSend}
              disabled={!canSend || isTyping}
              size="icon"
              className="size-8 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
            >
              <Send className="size-4" />
              <span className="sr-only">
                Send message <CornerDownLeft className="size-3" />
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span className="flex items-center gap-1.5">
              Send{" "}
              <kbd className="rounded bg-foreground/20 px-1 py-0.5 text-[10px] font-mono">
                Enter
              </kbd>
            </span>
          </TooltipContent>
        </Tooltip>
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
        Analysis Assistant can make mistakes. Verify important data.
      </p>
    </div>
  );
}
