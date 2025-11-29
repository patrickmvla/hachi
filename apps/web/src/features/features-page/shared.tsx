import { Check } from "lucide-react";

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
}: {
  icon: React.ReactNode;
  name: string;
  fullName: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange" | "pink" | "cyan";
  benefits: string[];
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

  return (
    <div className={`group p-6 rounded-2xl border ${colorClasses[color]} transition-all duration-300`}>
      <div className={`${iconColors[color]} mb-4`}>{icon}</div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{fullName}</p>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className={`size-4 ${iconColors[color]}`} />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const IntegrationCard = ({ name, category }: { name: string; category: string }) => {
  return (
    <div className="p-4 rounded-xl border bg-background hover:border-primary/30 transition-colors">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">{category}</p>
    </div>
  );
};
