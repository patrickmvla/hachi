import {
  Search,
  GitBranch,
  Database,
  ArrowRightLeft,
  Cpu,
  Eye,
  Users,
  Shield,
  Activity,
} from "lucide-react";
import { FeaturePoint, DetailCard } from "./shared";

const COLLAB_NODES = [
  { label: "Query", icon: Search, color: "#2563eb" },
  { label: "Embed", icon: GitBranch, color: "#ec4899" },
  { label: "Retriever", icon: Database, color: "#f97316" },
  { label: "Reranker", icon: ArrowRightLeft, color: "#eab308" },
  { label: "LLM", icon: Cpu, color: "#a855f7" },
];

const CURSORS = [
  { name: "Alice", color: "#2563eb", position: "top-[35%] right-[18%]" },
  { name: "Bob", color: "#7c3aed", position: "top-[55%] left-[40%]" },
  { name: "Carol", color: "#f97316", position: "top-[70%] right-[35%]" },
];

const SYNC_LOG = [
  { time: "12:04:31", user: "Alice", action: "updated LLM temperature to 0.8", color: "#2563eb" },
  { time: "12:04:28", user: "Bob", action: "added Reranker node", color: "#7c3aed" },
  { time: "12:04:25", user: "Carol", action: "opened Wire Tap on Retriever", color: "#f97316" },
];

export const CollaborationSection = () => {
  return (
    <section id="collaboration" className="py-24 sm:py-32 px-6 bg-[#fafafa] scroll-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Mockup column */}
          <div className="space-y-4">
            {/* Main mockup: Multi-user canvas */}
            <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                </div>
                <span className="text-[11px] text-black/30 tracking-wide">
                  team-pipeline.hachi
                </span>
                {/* Avatar stack */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {CURSORS.map((cursor) => (
                      <div
                        key={cursor.name}
                        className="size-5 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white"
                        style={{ backgroundColor: cursor.color }}
                      >
                        {cursor.name[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-black/30">3 online</span>
                </div>
              </div>

              {/* Canvas with cursors */}
              <div className="relative px-5 py-8 min-h-[240px]">
                <div
                  className="absolute inset-0 opacity-[0.3] pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Pipeline */}
                <div className="relative flex items-center gap-2 sm:gap-3">
                  {COLLAB_NODES.map((node, i) => {
                    const Icon = node.icon;
                    return (
                      <div key={node.label} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="size-10 sm:size-11 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                            style={{ borderColor: "#22c55e40" }}
                          >
                            <Icon className="size-3.5" style={{ color: node.color }} />
                          </div>
                          <span className="text-[8px] uppercase tracking-wider text-black/35 font-medium">
                            {node.label}
                          </span>
                          <div className="size-1.5 rounded-full bg-emerald-500" />
                        </div>
                        {i < COLLAB_NODES.length - 1 && (
                          <div className="flex-1 min-w-[12px]">
                            <div className="w-full h-[1.5px] bg-emerald-500/30 rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* User cursors */}
                {CURSORS.map((cursor) => (
                  <div
                    key={cursor.name}
                    className={`absolute ${cursor.position} pointer-events-none hidden sm:block`}
                  >
                    <svg
                      width="12"
                      height="16"
                      viewBox="0 0 12 16"
                      fill="none"
                      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
                    >
                      <path d="M0 0L12 9L5 9.5L3 16L0 0Z" fill={cursor.color} />
                    </svg>
                    <span
                      className="absolute left-3 top-3 text-[8px] font-semibold text-white px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: cursor.color }}
                    >
                      {cursor.name}
                    </span>
                  </div>
                ))}

                {/* Mini Wire Tap panel */}
                <div className="absolute bottom-2 right-2 hidden sm:block">
                  <div className="w-[120px] rounded-lg border border-black/[0.06] bg-white/90 backdrop-blur-sm p-2 shadow-sm">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Eye className="size-2.5 text-black/30" />
                      <span className="text-[7px] uppercase tracking-wider text-black/25 font-medium">
                        Wire Tap
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-3 rounded-full border border-white flex items-center justify-center text-[5px] font-bold text-white"
                        style={{ backgroundColor: "#f97316" }}
                      >
                        C
                      </div>
                      <span className="text-[8px] text-black/35">Carol viewing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] bg-black/[0.01]">
                <span className="text-[10px] text-black/30">
                  5 nodes &middot; all passing
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  synced
                </div>
              </div>
            </div>

            {/* Sync event log */}
            <div className="rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="px-3 py-2 border-b border-black/[0.06]">
                <span className="text-[10px] text-black/40 font-medium">Activity</span>
              </div>
              <div className="divide-y divide-black/[0.04]">
                {SYNC_LOG.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                    <span className="text-[9px] font-mono text-black/20 shrink-0">{entry.time}</span>
                    <div
                      className="size-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white shrink-0"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.user[0]}
                    </div>
                    <span className="text-[10px] text-black/40">
                      <span className="font-medium text-black/60">{entry.user}</span> {entry.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text column */}
          <div>
            <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
              Collaboration
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-[1.15] text-black mb-4">
              Build together,
              <br />
              in real time.
            </h2>
            <p className="text-[15px] leading-relaxed text-black/40 mb-8">
              See your teammates&apos; cursors on the canvas, watch them configure nodes, and share Wire Tap results — all in real time with zero setup.
            </p>
            <div className="space-y-4">
              <FeaturePoint
                title="Live cursors with presence"
                description="See who's on the canvas and what they're working on. Colored cursors with name labels."
              />
              <FeaturePoint
                title="Conflict-free sync (Yjs CRDT)"
                description="Concurrent edits merge automatically. No locking, no conflicts, no lost work."
              />
              <FeaturePoint
                title="Shared Wire Tap"
                description="When one person inspects a wire, everyone can see the results. Debug together."
              />
              <FeaturePoint
                title="Org-scoped access control"
                description="Owner, Admin, Editor, Viewer — four granular roles with fine-grained permissions."
              />
            </div>
          </div>
        </div>

        {/* Detail cards + mono */}
        <div className="mt-12">
          <div className="grid sm:grid-cols-3 gap-3">
            <DetailCard
              icon={Users}
              title="Team awareness"
              description="Live presence indicators show who's online. See which node each teammate is editing."
            />
            <DetailCard
              icon={Shield}
              title="Role-based access"
              description="Four granular roles control who can edit, execute, and manage pipeline settings."
            />
            <DetailCard
              icon={Activity}
              title="Activity feed"
              description="Timestamped log of every change. See who did what and when across the team."
            />
          </div>
          <p className="mt-6 text-[12px] font-mono text-black/20">
            yjs crdt · webrtc p2p · &lt;50ms sync · conflict-free merging
          </p>
        </div>
      </div>
    </section>
  );
};
