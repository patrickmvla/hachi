import { Users, Database } from "lucide-react";
import { FeaturePoint } from "./shared";

export const CollaborationSection = () => {
  return (
    <section id="collaboration" className="py-20 px-6 bg-[#fafafa] scroll-mt-16">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Demo */}
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="relative p-6 h-[380px]">
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Cursor Alice */}
              <div
                className="absolute top-16 left-20 flex items-start gap-1"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <svg width="10" height="14" viewBox="0 0 10 14" fill="#2563eb">
                  <path d="M0 0L10 7.5L5 8.5L6.5 14L4 13L2.5 8.5L0 10V0Z" />
                </svg>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">Alice</span>
              </div>

              {/* Cursor Bob */}
              <div
                className="absolute top-36 right-24 flex items-start gap-1"
                style={{ animation: "float 3s ease-in-out infinite", animationDelay: "1s" }}
              >
                <svg width="10" height="14" viewBox="0 0 10 14" fill="#7c3aed">
                  <path d="M0 0L10 7.5L5 8.5L6.5 14L4 13L2.5 8.5L0 10V0Z" />
                </svg>
                <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded font-medium">Bob</span>
              </div>

              {/* Selection */}
              <div className="absolute top-24 left-20 w-36 h-16 border-2 border-dashed border-blue-500/30 rounded-lg bg-blue-500/[0.03]" />

              {/* Node being moved */}
              <div className="absolute top-28 left-24 w-[110px]">
                <div className="p-2 rounded-lg border-2 border-emerald-500/30 bg-white shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Database className="size-3 text-emerald-600" />
                    <span className="text-[11px] font-medium text-black">Retriever</span>
                  </div>
                </div>
              </div>

              {/* Activity log */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl border border-black/[0.06] bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-black/50">Activity</span>
                  <div className="flex -space-x-1.5">
                    <div className="size-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">A</div>
                    <div className="size-5 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">B</div>
                    <div className="size-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">C</div>
                  </div>
                </div>
                <div className="space-y-1 text-[10px]">
                  <p><span className="text-blue-600 font-medium">Alice</span> <span className="text-black/30">moved Retriever node</span></p>
                  <p><span className="text-violet-600 font-medium">Bob</span> <span className="text-black/30">opened Wire Tap</span></p>
                </div>
              </div>

              {/* Sync badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Synced
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center justify-center size-10 rounded-lg border border-black/[0.06] text-violet-600 mb-5">
              <Users className="size-5" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
              Real-time Collaboration
            </h2>
            <p className="text-[15px] text-black/40 mb-8 leading-relaxed">
              Build architectures together. Senior engineers demonstrate patterns while
              juniors watch and learn. Debug together with shared context.
            </p>

            <div className="space-y-5">
              <FeaturePoint
                title="Live cursors"
                description="See where your teammates are working in real time. Colored cursors show who's doing what."
              />
              <FeaturePoint
                title="Instant sync"
                description="Changes sync instantly across all connected clients. No refresh, no merge conflicts."
              />
              <FeaturePoint
                title="Shared Wire Tap"
                description="When someone opens a Wire Tap, everyone sees the same data. Shared debugging context."
              />
              <FeaturePoint
                title="Shared execution"
                description="Run a pipeline and everyone sees the results. Great for demos and teaching sessions."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
