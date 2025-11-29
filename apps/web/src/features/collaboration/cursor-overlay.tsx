"use client";

import { MousePointer2 } from "lucide-react";

interface Cursor {
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface CursorOverlayProps {
  cursors: Cursor[];
}

export const CursorOverlay = ({ cursors }: CursorOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute transition-all duration-100 ease-linear"
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          }}
        >
          <MousePointer2
            size={16}
            className="fill-current"
            style={{ color: cursor.color }}
          />
          <div
            className="ml-4 px-2 py-0.5 rounded text-[10px] font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
};
