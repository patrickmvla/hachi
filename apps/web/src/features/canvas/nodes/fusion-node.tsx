"use client";

import { memo, useMemo } from "react";
import { type NodeProps } from "@xyflow/react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeShell } from "./node-shell";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

export const FusionNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const sources = getConfigValue<number>(data.config ?? {}, nodeDefaults.fusion, "sources");

  const inputPorts = useMemo(
    () => Array.from({ length: sources }, () => PortType.Documents),
    [sources]
  );

  return (
    <NodeShell
      id={id}
      selected={selected ?? false}
      data={data}
      inputs={inputPorts}
      outputs={[PortType.Documents]}
    />
  );
});

FusionNode.displayName = "FusionNode";
