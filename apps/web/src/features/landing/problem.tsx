"use client";

import { useEffect, useState } from "react";

const problems = [
  {
    number: "01",
    title: "Whiteboards don't execute",
    description: "You sketch architectures but can't test them. Ideas stay theoretical forever.",
  },
  {
    number: "02",
    title: "Failures are invisible",
    description: "Your pipeline returns bad results. You don't know which step failed or why.",
  },
  {
    number: "03",
    title: "Patterns stay on paper",
    description: "HyDE, CRAG, Fusion — reading papers doesn't show how components actually connect.",
  },
];

export const Problem = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative py-28 sm:py-36 px-6 bg-[#fafafa]">
      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="max-w-[520px] mb-20">
          <span
            className="text-[12px] tracking-wide text-black/35 uppercase block mb-5"
            style={mounted ? { animation: "fadeInUp 0.6s ease-out forwards" } : { opacity: 0 }}
          >
            The problem
          </span>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] leading-[1.15] text-black mb-5"
            style={mounted ? { animation: "fadeInUp 0.6s ease-out 80ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            You built naive RAG.<br />
            Now you&apos;re stuck.
          </h2>
          <p
            className="text-[16px] leading-relaxed text-black/40"
            style={mounted ? { animation: "fadeInUp 0.6s ease-out 160ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            Retrieve documents. Pass to an LLM. Get mediocre results. Sound familiar?
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-3 gap-px bg-black/[0.06] rounded-2xl overflow-hidden border border-black/[0.06]">
          {problems.map((problem, i) => (
            <div
              key={problem.number}
              className="bg-white p-8 sm:p-10 flex flex-col"
              style={mounted ? { animation: `fadeInUp 0.5s ease-out ${240 + i * 100}ms forwards`, opacity: 0 } : { opacity: 0 }}
            >
              <span className="text-[42px] font-bold text-black/[0.06] leading-none mb-6">
                {problem.number}
              </span>
              <h3 className="text-[15px] font-semibold text-black mb-3 leading-snug">
                {problem.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-black/40 flex-1">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Solution tease */}
        <div
          className="mt-14 flex items-center gap-3"
          style={mounted ? { animation: "fadeInUp 0.5s ease-out 600ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-black/[0.06] to-transparent" />
          <p className="text-[13px] text-black/35 shrink-0">
            What if you could <span className="text-black font-medium">see through</span> your entire pipeline?
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-black/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
};
