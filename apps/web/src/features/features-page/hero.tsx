import { Workflow, Eye, Play, Users, Box, Plug } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "canvas", label: "Visual Canvas", icon: Workflow },
  { id: "wiretap", label: "Wire Tap", icon: Eye },
  { id: "execution", label: "Execution", icon: Play },
  { id: "collaboration", label: "Collaboration", icon: Users },
  { id: "patterns", label: "RAG Patterns", icon: Box },
  { id: "integrations", label: "Integrations", icon: Plug },
];

export const FeaturesHero = () => {
  return (
    <section className="relative pt-28 pb-16 px-6 bg-white">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="max-w-[600px] mb-14">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
            Features
          </span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-black mb-5">
            Everything you need to<br />
            build better RAG systems
          </h1>
          <p className="text-[16px] leading-relaxed text-black/40">
            A complete toolkit for designing, executing, debugging, and collaborating on retrieval-augmented generation pipelines.
          </p>
        </div>

        {/* Section nav */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium text-black/40 rounded-lg border border-black/[0.06] hover:border-black/[0.12] hover:text-black/70 hover:bg-black/[0.02] transition-all"
              >
                <Icon className="size-3.5" />
                {section.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
    </section>
  );
};
