"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeShell } from "./node-shell";
import { nodeRegistry } from "@/features/playground/config/node-registry";

export const BaseNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const entry = nodeRegistry[data.type];
  const hasTarget = entry?.hasTargetHandle ?? true;

  return (
    <NodeShell
      id={id}
      selected={selected ?? false}
      data={data}
      inputs={hasTarget ? [PortType.Query] : []}
      outputs={[PortType.Query]}
    />
  );
});

BaseNode.displayName = "BaseNode";
