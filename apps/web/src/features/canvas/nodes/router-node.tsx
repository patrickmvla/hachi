"use client";

import { memo, useMemo } from "react";
import { type NodeProps } from "@xyflow/react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeShell } from "./node-shell";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

export const RouterNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const branches = getConfigValue<number>(data.config ?? {}, nodeDefaults.router, "branches");
  const outputs = useMemo(
    () => Array.from({ length: branches }, () => PortType.Query),
    [branches]
  );

  return (
    <NodeShell
      id={id}
      selected={selected ?? false}
      data={data}
      inputs={[PortType.Query]}
      outputs={outputs}
    />
  );
});

RouterNode.displayName = "RouterNode";
