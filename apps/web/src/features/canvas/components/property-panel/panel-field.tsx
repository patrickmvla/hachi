import type { ReactNode } from "react";

interface PanelFieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export const PanelField = ({ label, hint, children }: PanelFieldProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {hint && (
        <p className="text-[10px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};
