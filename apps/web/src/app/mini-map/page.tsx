"use client";

import { Suspense } from "react";
import { Playground } from "@/features/playground";

export default function MiniMapPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen" />}>
      <Playground />
    </Suspense>
  );
}
