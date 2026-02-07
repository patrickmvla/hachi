import * as React from "react"
import { cn } from "@hachi/ui/lib/utils"

const PageHeader = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const PageHeaderContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-header-content"
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

const PageHeaderTitle = ({
  className,
  ...props
}: React.ComponentProps<"h1">) => {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  )
}

const PageHeaderDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      data-slot="page-header-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

const PageHeaderActions = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
}
