import { Check, type LucideIcon } from "lucide-react";
import Link from "next/link";

export const DetailCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-4 rounded-xl border border-black/[0.06] bg-white hover:border-black/[0.12] transition-colors">
      <div className="flex items-center gap-2.5 mb-2">
        <Icon className="size-3.5 text-black/30" />
        <h4 className="text-[13px] font-semibold text-black">{title}</h4>
      </div>
      <p className="text-[12px] text-black/35 leading-relaxed">{description}</p>
    </div>
  );
};

export const FeaturePoint = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-3">
      <div className="size-5 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0 mt-0.5">
        <Check className="size-2.5 text-black/40" strokeWidth={3} />
      </div>
      <div>
        <h4 className="text-[14px] font-semibold text-black mb-0.5">{title}</h4>
        <p className="text-[13px] text-black/40 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const PatternCard = ({
  icon,
  name,
  fullName,
  description,
  color,
  benefits,
  benchmark,
  sandboxTemplate,
}: {
  icon: React.ReactNode;
  name: string;
  fullName: string;
  description: string;
  color: string;
  benefits: string[];
  benchmark?: string;
  sandboxTemplate?: string;
}) => {
  return (
    <div className="group p-6 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div style={{ color }}>{icon}</div>
        {benchmark && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}10`, color }}
          >
            {benchmark}
          </span>
        )}
      </div>
      <h3 className="text-[17px] font-bold text-black mb-1">{name}</h3>
      <p className="text-[11px] text-black/30 uppercase tracking-wide mb-2">{fullName}</p>
      <p className="text-[13px] text-black/40 mb-4 leading-relaxed flex-1">{description}</p>
      <ul className="space-y-1.5">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-[12px] text-black/50">
            <Check className="size-3 shrink-0" style={{ color }} strokeWidth={3} />
            {benefit}
          </li>
        ))}
      </ul>
      {sandboxTemplate && (
        <Link
          href={`/mini-map?template=${sandboxTemplate}`}
          className="mt-4 text-[12px] font-medium hover:underline"
          style={{ color }}
        >
          Try in mini map &rarr;
        </Link>
      )}
    </div>
  );
};
