"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeShell } from "./node-shell";

export const WebSearchNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => (
  <NodeShell
    id={id}
    selected={selected ?? false}
    data={data}
    inputs={[PortType.Query]}
    outputs={[PortType.Documents]}
  />
));

WebSearchNode.displayName = "WebSearchNode";
