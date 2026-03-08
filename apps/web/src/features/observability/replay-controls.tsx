"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import type { PlaybackSpeed } from "./hooks/use-replay";

interface ReplayControlsProps {
  isPlaying: boolean;
  progress: number;
  currentIndex: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSetSpeed: (speed: PlaybackSpeed) => void;
}

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 5];

export const ReplayControls = ({
  isPlaying,
  progress,
  currentIndex,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onResume,
  onStepForward,
  onStepBack,
  onSetSpeed,
}: ReplayControlsProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-black/[0.08] rounded-lg shadow-sm">
      {/* Play/Pause */}
      <div className="flex items-center gap-1">
        <button
          onClick={onStepBack}
          disabled={currentIndex === 0}
          className="p-1.5 hover:bg-black/5 rounded disabled:opacity-30 transition-colors"
          title="Step back"
        >
          <SkipBack size={14} />
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            title="Pause"
          >
            <Pause size={14} />
          </button>
        ) : (
          <button
            onClick={progress >= 1 ? onPlay : onResume}
            className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            title={progress >= 1 ? "Replay" : "Play"}
          >
            <Play size={14} className="fill-current" />
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={progress >= 1}
          className="p-1.5 hover:bg-black/5 rounded disabled:opacity-30 transition-colors"
          title="Step forward"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <span className="text-[10px] text-black/40 font-mono min-w-[40px] text-center">
        {Math.floor(currentIndex / 2)}/{totalSteps}
      </span>

      {/* Speed selector */}
      <div className="flex items-center gap-0.5 border-l border-black/[0.08] pl-3">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSetSpeed(s)}
            className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
              speed === s
                ? "bg-primary text-primary-foreground"
                : "text-black/40 hover:text-black/70 hover:bg-black/5"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
