"use client";

import { useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { usePlaygroundStore } from "../store/playground-store";
import { nodeRegistry } from "../config/node-registry";

function ConfigField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function NumberInput({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

function SliderInput({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-primary"
      />
      <span className="text-xs text-muted-foreground w-8 text-right">{value}</span>
    </div>
  );
}

function TextInput({
  value,
  placeholder,
  multiline,
  onChange,
}: {
  value: string;
  placeholder?: string;
  multiline?: boolean;
  onChange: (val: string) => void;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

function NodeConfigForm({
  nodeType,
  config,
  onUpdate,
}: {
  nodeType: string;
  config: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}) {
  switch (nodeType) {
    case "query":
      return (
        <p className="text-xs text-muted-foreground">
          The entry point for your pipeline. Connect this to the first processing step.
        </p>
      );

    case "hyde":
      return (
        <>
          <ConfigField label="Model">
            <SelectInput
              value={(config.model as string) ?? "gpt-4-turbo"}
              options={["gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo", "claude-3-sonnet"]}
              onChange={(v) => onUpdate("model", v)}
            />
          </ConfigField>
          <ConfigField label="Max Tokens">
            <NumberInput
              value={(config.maxTokens as number) ?? 256}
              min={64}
              max={2048}
              step={64}
              onChange={(v) => onUpdate("maxTokens", v)}
            />
          </ConfigField>
        </>
      );

    case "embedding":
      return (
        <>
          <ConfigField label="Model">
            <SelectInput
              value={(config.model as string) ?? "text-embedding-3-small"}
              options={["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002"]}
              onChange={(v) => onUpdate("model", v)}
            />
          </ConfigField>
          <ConfigField label="Dimensions">
            <NumberInput
              value={(config.dimensions as number) ?? 1536}
              min={256}
              max={3072}
              step={256}
              onChange={(v) => onUpdate("dimensions", v)}
            />
          </ConfigField>
        </>
      );

    case "retriever":
      return (
        <>
          <ConfigField label="Top K">
            <NumberInput
              value={(config.topK as number) ?? 5}
              min={1}
              max={20}
              onChange={(v) => onUpdate("topK", v)}
            />
          </ConfigField>
          <ConfigField label="Similarity Threshold">
            <SliderInput
              value={(config.similarityThreshold as number) ?? 0.8}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => onUpdate("similarityThreshold", v)}
            />
          </ConfigField>
          <ConfigField label="Vector Store">
            <SelectInput
              value={(config.vectorStore as string) ?? "default"}
              options={["default", "pinecone", "weaviate", "qdrant", "chroma"]}
              onChange={(v) => onUpdate("vectorStore", v)}
            />
          </ConfigField>
        </>
      );

    case "reranker":
      return (
        <>
          <ConfigField label="Top N">
            <NumberInput
              value={(config.topN as number) ?? 3}
              min={1}
              max={10}
              onChange={(v) => onUpdate("topN", v)}
            />
          </ConfigField>
          <ConfigField label="Model">
            <SelectInput
              value={(config.model as string) ?? "cross-encoder/ms-marco"}
              options={["cross-encoder/ms-marco", "bge-reranker-large", "cohere-rerank-v3"]}
              onChange={(v) => onUpdate("model", v)}
            />
          </ConfigField>
        </>
      );

    case "judge":
      return (
        <>
          <ConfigField label="Criteria">
            <SelectInput
              value={(config.criteria as string) ?? "relevance"}
              options={["relevance", "faithfulness", "coherence", "completeness"]}
              onChange={(v) => onUpdate("criteria", v)}
            />
          </ConfigField>
          <ConfigField label="Confidence Threshold">
            <SliderInput
              value={(config.confidenceThreshold as number) ?? 0.85}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => onUpdate("confidenceThreshold", v)}
            />
          </ConfigField>
        </>
      );

    case "llm":
      return (
        <>
          <ConfigField label="Model">
            <SelectInput
              value={(config.model as string) ?? "gpt-4-turbo"}
              options={["gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo", "claude-3-opus", "claude-3-sonnet"]}
              onChange={(v) => onUpdate("model", v)}
            />
          </ConfigField>
          <ConfigField label="Temperature">
            <SliderInput
              value={(config.temperature as number) ?? 0.7}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => onUpdate("temperature", v)}
            />
          </ConfigField>
          <ConfigField label="Max Tokens">
            <NumberInput
              value={(config.maxTokens as number) ?? 1024}
              min={64}
              max={4096}
              step={64}
              onChange={(v) => onUpdate("maxTokens", v)}
            />
          </ConfigField>
          <ConfigField label="System Prompt">
            <TextInput
              value={(config.systemPrompt as string) ?? ""}
              placeholder="Optional system prompt..."
              multiline
              onChange={(v) => onUpdate("systemPrompt", v)}
            />
          </ConfigField>
        </>
      );

    case "agent":
      return (
        <>
          <ConfigField label="Model">
            <SelectInput
              value={(config.model as string) ?? "gpt-4-turbo"}
              options={["gpt-4-turbo", "gpt-4o", "claude-3-opus", "claude-3-sonnet"]}
              onChange={(v) => onUpdate("model", v)}
            />
          </ConfigField>
          <ConfigField label="Max Iterations">
            <NumberInput
              value={(config.maxIterations as number) ?? 5}
              min={1}
              max={20}
              onChange={(v) => onUpdate("maxIterations", v)}
            />
          </ConfigField>
          <ConfigField label="Tools">
            <TextInput
              value={((config.tools as string[]) ?? []).join(", ")}
              placeholder="Comma-separated tools..."
              onChange={(v) =>
                onUpdate(
                  "tools",
                  v.split(",").map((t) => t.trim()).filter(Boolean)
                )
              }
            />
          </ConfigField>
        </>
      );

    default:
      return null;
  }
}

export function PlaygroundPropertyPanel() {
  const selectedNodeId = usePlaygroundStore((s) => s.selectedNodeId);
  const nodes = usePlaygroundStore((s) => s.nodes);
  const updateNodeData = usePlaygroundStore((s) => s.updateNodeData);
  const showPropertyPanel = usePlaygroundStore((s) => s.showPropertyPanel);
  const setShowPropertyPanel = usePlaygroundStore((s) => s.setShowPropertyPanel);
  const setSelectedNodeId = usePlaygroundStore((s) => s.setSelectedNodeId);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  if (!showPropertyPanel || !selectedNode) return null;

  const registry = nodeRegistry[selectedNode.data.type];
  if (!registry) return null;

  const Icon = registry.icon;
  const config = selectedNode.data.config ?? {};

  const handleConfigUpdate = useCallback(
    (key: string, value: unknown) => {
      if (!selectedNodeId) return;
      updateNodeData(selectedNodeId, {
        config: { ...config, [key]: value },
      });
    },
    [selectedNodeId, config, updateNodeData]
  );

  const handleLabelChange = useCallback(
    (label: string) => {
      if (!selectedNodeId) return;
      updateNodeData(selectedNodeId, { label });
    },
    [selectedNodeId, updateNodeData]
  );

  return (
    <div className="w-64 border-l border-border bg-background overflow-y-auto shrink-0">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className={registry.color} />
          <span className="text-xs font-semibold">{registry.label}</span>
        </div>
        <button
          onClick={() => {
            setSelectedNodeId(null);
            setShowPropertyPanel(false);
          }}
          className="p-0.5 rounded hover:bg-muted text-muted-foreground"
          aria-label="Close panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <ConfigField label="Label">
          <TextInput
            value={selectedNode.data.label}
            onChange={handleLabelChange}
          />
        </ConfigField>

        <div className="h-px bg-border" />

        <NodeConfigForm
          nodeType={selectedNode.data.type}
          config={config}
          onUpdate={handleConfigUpdate}
        />
      </div>
    </div>
  );
}
