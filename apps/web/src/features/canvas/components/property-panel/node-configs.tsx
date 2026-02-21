"use client";

import { useState } from "react";
import { Info, X, Plus } from "lucide-react";
import { PanelField } from "./panel-field";

interface ConfigProps {
  config: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}

const inputClass =
  "w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary";
const selectClass =
  "w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary";

// --- Query ---
export const QueryConfig = () => (
  <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
    <Info size={14} className="mt-0.5 shrink-0" />
    <span>Input node — no configuration needed. Connect this to downstream nodes to pass user queries.</span>
  </div>
);

// --- HyDE ---
export const HyDEConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Model">
      <select
        className={selectClass}
        value={(config.model as string) ?? "gpt-4-turbo"}
        onChange={(e) => onUpdate("model", e.target.value)}
      >
        <option value="gpt-4-turbo">gpt-4-turbo</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="claude-3-opus">claude-3-opus</option>
        <option value="claude-3-sonnet">claude-3-sonnet</option>
      </select>
    </PanelField>
    <PanelField label="Max Tokens" hint="Maximum tokens for hypothetical document">
      <input
        type="number"
        className={inputClass}
        value={(config.maxTokens as number) ?? 256}
        min={1}
        max={4096}
        onChange={(e) => onUpdate("maxTokens", Number(e.target.value))}
      />
    </PanelField>
  </>
);

// --- Embedding ---
export const EmbeddingConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Model">
      <select
        className={selectClass}
        value={(config.model as string) ?? "text-embedding-3-small"}
        onChange={(e) => onUpdate("model", e.target.value)}
      >
        <option value="text-embedding-3-small">text-embedding-3-small</option>
        <option value="text-embedding-3-large">text-embedding-3-large</option>
        <option value="text-embedding-ada-002">text-embedding-ada-002</option>
      </select>
    </PanelField>
    <PanelField label="Dimensions" hint="Output vector dimensions">
      <input
        type="number"
        className={inputClass}
        value={(config.dimensions as number) ?? 1536}
        min={1}
        onChange={(e) => onUpdate("dimensions", Number(e.target.value))}
      />
    </PanelField>
  </>
);

// --- Retriever ---
export const RetrieverConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Top K" hint="Number of documents to retrieve">
      <input
        type="number"
        className={inputClass}
        value={(config.topK as number) ?? 5}
        min={1}
        max={100}
        onChange={(e) => onUpdate("topK", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="Similarity Threshold">
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="flex-1"
          min={0}
          max={1}
          step={0.05}
          value={(config.similarityThreshold as number) ?? 0.8}
          onChange={(e) => onUpdate("similarityThreshold", Number(e.target.value))}
        />
        <span className="text-xs w-8 text-right font-mono">
          {((config.similarityThreshold as number) ?? 0.8).toFixed(2)}
        </span>
      </div>
    </PanelField>
    <PanelField label="Vector Store">
      <input
        type="text"
        className={inputClass}
        value={(config.vectorStore as string) ?? "default"}
        onChange={(e) => onUpdate("vectorStore", e.target.value)}
      />
    </PanelField>
  </>
);

// --- Reranker ---
export const RerankerConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Top N" hint="Number of results after reranking">
      <input
        type="number"
        className={inputClass}
        value={(config.topN as number) ?? 3}
        min={1}
        max={100}
        onChange={(e) => onUpdate("topN", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="Model">
      <select
        className={selectClass}
        value={(config.model as string) ?? "cross-encoder/ms-marco"}
        onChange={(e) => onUpdate("model", e.target.value)}
      >
        <option value="cross-encoder/ms-marco">cross-encoder/ms-marco</option>
        <option value="cohere-rerank-v3">cohere-rerank-v3</option>
        <option value="bge-reranker-large">bge-reranker-large</option>
      </select>
    </PanelField>
  </>
);

// --- Judge ---
export const JudgeConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Criteria">
      <select
        className={selectClass}
        value={(config.criteria as string) ?? "relevance"}
        onChange={(e) => onUpdate("criteria", e.target.value)}
      >
        <option value="relevance">Relevance</option>
        <option value="accuracy">Accuracy</option>
        <option value="completeness">Completeness</option>
      </select>
    </PanelField>
    <PanelField label="Confidence Threshold">
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="flex-1"
          min={0}
          max={1}
          step={0.05}
          value={(config.confidenceThreshold as number) ?? 0.85}
          onChange={(e) => onUpdate("confidenceThreshold", Number(e.target.value))}
        />
        <span className="text-xs w-8 text-right font-mono">
          {((config.confidenceThreshold as number) ?? 0.85).toFixed(2)}
        </span>
      </div>
    </PanelField>
  </>
);

// --- LLM ---
export const LLMConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Model">
      <select
        className={selectClass}
        value={(config.model as string) ?? "gpt-4-turbo"}
        onChange={(e) => onUpdate("model", e.target.value)}
      >
        <option value="gpt-4-turbo">gpt-4-turbo</option>
        <option value="gpt-4o">gpt-4o</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="claude-3-opus">claude-3-opus</option>
        <option value="claude-3-sonnet">claude-3-sonnet</option>
      </select>
    </PanelField>
    <PanelField label="Temperature">
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="flex-1"
          min={0}
          max={1}
          step={0.1}
          value={(config.temperature as number) ?? 0.7}
          onChange={(e) => onUpdate("temperature", Number(e.target.value))}
        />
        <span className="text-xs w-8 text-right font-mono">
          {((config.temperature as number) ?? 0.7).toFixed(1)}
        </span>
      </div>
    </PanelField>
    <PanelField label="Max Tokens">
      <input
        type="number"
        className={inputClass}
        value={(config.maxTokens as number) ?? 1024}
        min={1}
        max={128000}
        onChange={(e) => onUpdate("maxTokens", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="System Prompt">
      <textarea
        className={`${inputClass} min-h-[60px] resize-y`}
        value={(config.systemPrompt as string) ?? ""}
        placeholder="Optional system instructions..."
        onChange={(e) => onUpdate("systemPrompt", e.target.value)}
      />
    </PanelField>
  </>
);

// --- Agent ---
export const AgentConfig = ({ config, onUpdate }: ConfigProps) => {
  const [newTool, setNewTool] = useState("");
  const tools = (config.tools as string[]) ?? ["Web Search", "Code Exec"];

  const addTool = () => {
    const trimmed = newTool.trim();
    if (trimmed && !tools.includes(trimmed)) {
      onUpdate("tools", [...tools, trimmed]);
      setNewTool("");
    }
  };

  const removeTool = (tool: string) => {
    onUpdate("tools", tools.filter((t) => t !== tool));
  };

  return (
    <>
      <PanelField label="Model">
        <select
          className={selectClass}
          value={(config.model as string) ?? "gpt-4-turbo"}
          onChange={(e) => onUpdate("model", e.target.value)}
        >
          <option value="gpt-4-turbo">gpt-4-turbo</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="claude-3-opus">claude-3-opus</option>
          <option value="claude-3-sonnet">claude-3-sonnet</option>
        </select>
      </PanelField>
      <PanelField label="Max Iterations">
        <input
          type="number"
          className={inputClass}
          value={(config.maxIterations as number) ?? 5}
          min={1}
          max={50}
          onChange={(e) => onUpdate("maxIterations", Number(e.target.value))}
        />
      </PanelField>
      <PanelField label="Tools">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-1 text-[11px] bg-muted text-foreground px-2 py-0.5 rounded-full"
            >
              {tool}
              <button
                onClick={() => removeTool(tool)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${tool}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            className={inputClass}
            value={newTool}
            placeholder="Add tool..."
            onChange={(e) => setNewTool(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTool();
              }
            }}
          />
          <button
            onClick={addTool}
            className="px-2 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
            aria-label="Add tool"
          >
            <Plus size={14} />
          </button>
        </div>
      </PanelField>
    </>
  );
};

// Config panel registry
export const CONFIG_PANELS: Record<
  string,
  React.ComponentType<ConfigProps> | React.ComponentType
> = {
  query: QueryConfig,
  hyde: HyDEConfig,
  embedding: EmbeddingConfig,
  retriever: RetrieverConfig,
  reranker: RerankerConfig,
  judge: JudgeConfig,
  llm: LLMConfig,
  agent: AgentConfig,
};
