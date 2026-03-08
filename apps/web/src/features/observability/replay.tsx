"use client";

import { useReplay } from "./hooks/use-replay";
import { useRunSpans } from "./hooks/use-observability-queries";
import { ReplayControls } from "./replay-controls";

interface ReplayProps {
  runId: string;
}

export const Replay = ({ runId }: ReplayProps) => {
  const { data: spans, isLoading } = useRunSpans(runId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16 text-[11px] text-black/30">
        Loading run data...
      </div>
    );
  }

  if (!spans || spans.length === 0) {
    return (
      <div className="flex items-center justify-center h-16 text-[11px] text-black/30">
        No span data available for replay
      </div>
    );
  }

  return <ReplayPlayer runId={runId} spans={spans} />;
};

function ReplayPlayer({ runId, spans }: { runId: string; spans: any[] }) {
  const replay = useReplay(runId, spans);

  return (
    <ReplayControls
      isPlaying={replay.isPlaying}
      progress={replay.progress}
      currentIndex={replay.currentIndex}
      totalSteps={replay.totalSteps}
      speed={replay.speed}
      onPlay={replay.play}
      onPause={replay.pause}
      onResume={replay.resume}
      onStepForward={replay.stepForward}
      onStepBack={replay.stepBack}
      onSetSpeed={replay.setSpeed}
    />
  );
}
