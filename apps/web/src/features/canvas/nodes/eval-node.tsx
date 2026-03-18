"use client";

import { memo, useMemo } from "react";
import { type NodeProps } from "@xyflow/react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeShell } from "./node-shell";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

const METRIC_INPUTS: Record<string, PortType[]> = {
  faithfulness: [PortType.Query, PortType.LlmResponse, PortType.Documents],
  relevancy: [PortType.Query, PortType.LlmResponse],
  context_precision: [PortType.Query, PortType.Documents],
};

export const EvalNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const metric = getConfigValue<string>(data.config ?? {}, nodeDefaults.evaluator, "metric");
  const inputPorts = useMemo(
    () => METRIC_INPUTS[metric] ?? METRIC_INPUTS.faithfulness!,
    [metric]
  );

  return (
    <NodeShell
      id={id}
      selected={selected ?? false}
      data={data}
      inputs={inputPorts}
      outputs={[PortType.Score]}
    />
  );
});

EvalNode.displayName = "EvalNode";
