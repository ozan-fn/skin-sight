import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient";
  children: React.ReactNode;
}

export function GlassCard({
  className,
  variant = "default",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl backdrop-blur-2xl border shadow-2xl",
        variant === "default"
          ? "bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))] border-white/20"
          : "bg-white/10 border-white/30",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardHeader({
  className,
  children,
  ...props
}: GlassCardHeaderProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function GlassCardTitle({
  className,
  children,
  ...props
}: GlassCardTitleProps) {
  return (
    <h3
      className={cn("text-xl md:text-2xl font-semibold text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardContent({
  className,
  children,
  ...props
}: GlassCardContentProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardFooter({
  className,
  children,
  ...props
}: GlassCardFooterProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
