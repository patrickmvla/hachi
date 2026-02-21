"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hachi/ui/components/collapsible";
import { cn } from "@hachi/ui/lib/utils";

interface PanelSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const PanelSection = ({
  title,
  icon,
  defaultOpen = true,
  children,
}: PanelSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 transition-colors">
        <ChevronRight
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-90"
          )}
        />
        {icon}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1 space-y-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
