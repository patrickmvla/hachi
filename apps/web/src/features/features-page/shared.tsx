import { Check, TrendingUp } from "lucide-react";
import Link from "next/link";

export const FeaturePoint = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-4">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
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
  color: "blue" | "purple" | "green" | "orange" | "pink" | "cyan";
  benefits: string[];
  benchmark?: string;
  sandboxTemplate?: string;
}) => {
  const colorClasses = {
    blue: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50",
    purple: "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50",
    green: "border-green-500/30 bg-green-500/5 hover:border-green-500/50",
    orange: "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50",
    pink: "border-pink-500/30 bg-pink-500/5 hover:border-pink-500/50",
    cyan: "border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/50",
  };

  const iconColors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-green-500",
    orange: "text-orange-500",
    pink: "text-pink-500",
    cyan: "text-cyan-500",
  };

  const badgeBg = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className={`group p-6 rounded-2xl border ${colorClasses[color]} transition-all duration-300 flex flex-col`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColors[color]}`}>{icon}</div>
        {benchmark && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${badgeBg[color]}`}>
            <TrendingUp className="size-3" />
            {benchmark}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{fullName}</p>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2 flex-1">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className={`size-4 ${iconColors[color]}`} />
            {benefit}
          </li>
        ))}
      </ul>
      {sandboxTemplate && (
        <Link
          href={`/sandbox?template=${sandboxTemplate}`}
          className={`mt-4 text-sm font-medium ${iconColors[color]} hover:underline`}
        >
          Try it in sandbox →
        </Link>
      )}
    </div>
  );
};

export const IntegrationCard = ({
  name,
  category,
  features,
  status,
}: {
  name: string;
  category: string;
  features?: string[];
  status?: "native" | "compatible" | "community";
}) => {
  const statusBadge = {
    native: "bg-green-500/10 text-green-600 dark:text-green-400",
    compatible: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    community: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="p-4 rounded-xl border bg-background hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <p className="font-semibold">{name}</p>
        {status && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusBadge[status]}`}>
            {status}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-2">{category}</p>
      {features && features.length > 0 && (
        <p className="text-xs text-muted-foreground/70">{features.join(" · ")}</p>
      )}
    </div>
  );
};
