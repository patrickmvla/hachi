"use client";

import { type ReactNode } from "react";
import { cn } from "@hachi/ui/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";
export type NodeStatusVariant = "overlay" | "border";

interface NodeStatusIndicatorProps {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
}

/**
 * A wrapper component that displays status indicators around nodes
 * Supports loading, success, error, and initial states
 */
export const NodeStatusIndicator = ({
  status = "initial",
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  const statusColors = {
    initial: "",
    loading: "border-blue-500",
    success: "border-green-500",
    error: "border-red-500",
  };

  const overlayColors = {
    initial: "",
    loading: "bg-blue-500/10",
    success: "bg-green-500/10",
    error: "bg-red-500/10",
  };

  if (variant === "overlay") {
    return (
      <div className={cn("relative", className)}>
        {children}
        {status === "loading" && (
          <div
            className={cn(
              "absolute inset-0 rounded-lg flex items-center justify-center",
              overlayColors[status]
            )}
          >
            <LoadingSpinner />
          </div>
        )}
        {status === "success" && (
          <div
            className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
            )}
          >
            <CheckIcon />
          </div>
        )}
        {status === "error" && (
          <div
            className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
            )}
          >
            <XIcon />
          </div>
        )}
      </div>
    );
  }

  // Border variant
  return (
    <div
      className={cn(
        "relative",
        status === "loading" && "animate-pulse",
        className
      )}
    >
      {status === "loading" && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2 animate-spin-slow",
            statusColors[status]
          )}
          style={{
            borderStyle: "dashed",
            borderWidth: "2px",
            animation: "spin 2s linear infinite",
          }}
        />
      )}
      {status === "success" && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2",
            statusColors[status]
          )}
        />
      )}
      {status === "error" && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2",
            statusColors[status]
          )}
        />
      )}
      {children}
    </div>
  );
};

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-blue-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
