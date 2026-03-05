"use client";

import { Handle, Position, type HandleProps } from "@xyflow/react";
import { PortType, PORT_TYPE_COLORS } from "@hachi/schemas/nodes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hachi/ui/components/tooltip";

const PORT_TYPE_LABELS: Record<PortType, string> = {
  [PortType.Query]: "Query",
  [PortType.Text]: "Text",
  [PortType.Embedding]: "Embedding",
  [PortType.Documents]: "Documents",
  [PortType.Response]: "Response",
  [PortType.Judgments]: "Judgments",
  [PortType.HypotheticalDocs]: "Hypothetical Docs",
};

interface TypedHandleProps extends Omit<HandleProps, "id"> {
  portType: PortType;
}

export const TypedHandle = ({ portType, type, position, ...props }: TypedHandleProps) => {
  const color = PORT_TYPE_COLORS[portType];
  const label = PORT_TYPE_LABELS[portType];
  const handleId = `${type === "source" ? "source" : "target"}-${portType}`;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Handle
            id={handleId}
            type={type}
            position={position}
            className="!w-3 !h-3 !border-2 !border-background"
            style={{ backgroundColor: color }}
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent
          side={position === Position.Top ? "top" : "bottom"}
          className="text-[10px] px-2 py-1"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
