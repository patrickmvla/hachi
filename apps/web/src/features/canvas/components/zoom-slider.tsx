"use client";

import { Panel, useReactFlow, useViewport, type PanelPosition } from "@xyflow/react";
import { Minus, Plus, Maximize } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";

interface ZoomSliderProps {
  position?: PanelPosition;
  orientation?: "horizontal" | "vertical";
  className?: string;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * A zoom control component with slider and buttons
 */
export const ZoomSlider = ({
  position = "bottom-left",
  orientation = "horizontal",
  className,
  minZoom = 0.1,
  maxZoom = 2,
}: ZoomSliderProps) => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const { zoom, x, y } = useViewport();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setViewport({ x, y, zoom: newZoom });
  };

  const zoomPercentage = Math.round(zoom * 100);

  const isVertical = orientation === "vertical";

  return (
    <Panel position={position} className={cn("!m-2", className)}>
      <div
        className={cn(
          "flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg",
          isVertical && "flex-col"
        )}
      >
        {/* Zoom Out Button */}
        <button
          onClick={() => zoomOut()}
          className="p-1.5 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Zoom Out"
        >
          <Minus size={14} />
        </button>

        {/* Slider */}
        <div
          className={cn(
            "flex items-center gap-2",
            isVertical && "flex-col"
          )}
        >
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={0.01}
            value={zoom}
            onChange={handleSliderChange}
            className={cn(
              "accent-[var(--primary)] cursor-pointer",
              isVertical ? "h-20 w-2 -rotate-90" : "w-20 h-2"
            )}
            style={{
              WebkitAppearance: "none",
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((zoom - minZoom) / (maxZoom - minZoom)) * 100}%, var(--muted) ${((zoom - minZoom) / (maxZoom - minZoom)) * 100}%, var(--muted) 100%)`,
              borderRadius: "4px",
            }}
          />
          <span className="text-xs font-mono text-[var(--muted-foreground)] min-w-[3ch] text-center">
            {zoomPercentage}%
          </span>
        </div>

        {/* Zoom In Button */}
        <button
          onClick={() => zoomIn()}
          className="p-1.5 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Zoom In"
        >
          <Plus size={14} />
        </button>

        {/* Divider */}
        <div
          className={cn(
            "bg-[var(--border)]",
            isVertical ? "w-full h-px" : "w-px h-4"
          )}
        />

        {/* Fit View Button */}
        <button
          onClick={() => fitView({ padding: 0.2 })}
          className="p-1.5 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Fit View"
        >
          <Maximize size={14} />
        </button>
      </div>
    </Panel>
  );
};
