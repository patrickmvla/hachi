import * as React from "react"
import { cn } from "@hachi/ui/lib/utils"

interface StatCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string
    positive?: boolean
  }
  description?: string
}

const StatCard = ({
  className,
  label,
  value,
  icon,
  trend,
  description,
  ...props
}: StatCardProps) => {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "p-6 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden group",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {(trend || description) && (
        <div className="mt-4 flex items-center text-xs">
          {trend ? (
            <span
              className={cn(
                "font-medium",
                trend.positive !== false ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.value}
            </span>
          ) : (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}

export { StatCard, type StatCardProps }
