"use client";

/**
 * Custom SVG markers for edges
 * These must be rendered once in the SVG defs section
 */
export const EdgeMarkers = () => {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {/* Standard arrow marker */}
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
        </marker>

        {/* Arrow marker for selected edges */}
        <marker
          id="arrow-selected"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
        </marker>

        {/* Circle marker for data flow */}
        <marker
          id="circle"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="var(--muted-foreground)" />
        </marker>

        {/* Circle marker selected */}
        <marker
          id="circle-selected"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="var(--primary)" />
        </marker>

        {/* Diamond marker for conditional edges */}
        <marker
          id="diamond"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill="var(--muted-foreground)" />
        </marker>

        {/* Diamond marker selected */}
        <marker
          id="diamond-selected"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill="var(--primary)" />
        </marker>

        {/* Closed arrow (filled) */}
        <marker
          id="arrow-closed"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 12 6 L 0 12 L 3 6 z"
            fill="var(--muted-foreground)"
            stroke="var(--muted-foreground)"
            strokeWidth="0.5"
          />
        </marker>

        {/* Closed arrow selected */}
        <marker
          id="arrow-closed-selected"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 12 6 L 0 12 L 3 6 z"
            fill="var(--primary)"
            stroke="var(--primary)"
            strokeWidth="0.5"
          />
        </marker>

        {/* Error marker (red) */}
        <marker
          id="arrow-error"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--destructive)" />
        </marker>

        {/* Success marker (green) */}
        <marker
          id="arrow-success"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
        </marker>
      </defs>
    </svg>
  );
};

/**
 * Helper to get marker URL based on type and state
 */
export const getMarkerUrl = (
  type: "arrow" | "circle" | "diamond" | "arrow-closed" | "error" | "success" = "arrow",
  selected = false
): string => {
  if (type === "error") return "url(#arrow-error)";
  if (type === "success") return "url(#arrow-success)";
  return `url(#${type}${selected ? "-selected" : ""})`;
};

/**
 * Marker types available
 */
export type MarkerType = "arrow" | "circle" | "diamond" | "arrow-closed" | "error" | "success";
