import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@hachi/ui/lib/utils"
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  XCircle,
  PauseCircle,
} from "lucide-react"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium w-fit",
  {
    variants: {
      status: {
        success: "bg-green-500/10 text-green-600 dark:text-green-400",
        error: "bg-red-500/10 text-red-600 dark:text-red-400",
        failed: "bg-red-500/10 text-red-600 dark:text-red-400",
        warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        running: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        pending: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        completed: "bg-green-500/10 text-green-600 dark:text-green-400",
        cancelled: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

type StatusType = NonNullable<VariantProps<typeof statusBadgeVariants>["status"]>

const statusIcons: Record<StatusType, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  completed: CheckCircle2,
  error: AlertCircle,
  failed: XCircle,
  warning: AlertCircle,
  info: Clock,
  running: Loader2,
  pending: Clock,
  cancelled: XCircle,
  paused: PauseCircle,
}

const statusLabels: Record<StatusType, string> = {
  success: "Success",
  completed: "Completed",
  error: "Error",
  failed: "Failed",
  warning: "Warning",
  info: "Info",
  running: "Running",
  pending: "Pending",
  cancelled: "Cancelled",
  paused: "Paused",
}

interface StatusBadgeProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean
  label?: string
}

const StatusBadge = ({
  className,
  status = "pending",
  showIcon = true,
  label,
  ...props
}: StatusBadgeProps) => {
  const Icon = status ? statusIcons[status] : statusIcons.pending
  const displayLabel = label || (status ? statusLabels[status] : statusLabels.pending)
  const isAnimated = status === "running"

  return (
    <div
      data-slot="status-badge"
      data-status={status}
      className={cn(statusBadgeVariants({ status }), className)}
      role="status"
      aria-label={displayLabel}
      {...props}
    >
      {showIcon && (
        <Icon
          size={14}
          className={cn(isAnimated && "animate-spin")}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </div>
  )
}

export { StatusBadge, statusBadgeVariants, type StatusBadgeProps, type StatusType }
