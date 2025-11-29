"use client";

import { Canvas } from "@/features/canvas/canvas";
import { PresenceAvatars } from "@/features/collaboration/presence-avatars";
import { CursorOverlay } from "@/features/collaboration/cursor-overlay";

export default function CanvasEditorPage() {
  // Mock collaboration data
  const users = [
    { id: "1", name: "Alice", color: "#f87171" },
    { id: "2", name: "Bob", color: "#60a5fa" },
  ];

  const cursors = [
    { userId: "2", x: 400, y: 300, color: "#60a5fa", name: "Bob" },
  ];

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-3 right-4 z-10">
        <PresenceAvatars users={users} />
      </div>
      
      <div className="flex-1 relative">
        <Canvas />
        <CursorOverlay cursors={cursors} />
      </div>
    </div>
  );
}
