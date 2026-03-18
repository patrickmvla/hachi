"use client";

import { useState } from "react";
import { Info, X, Plus } from "lucide-react";
import { Input } from "@hachi/ui";
import { Textarea } from "@hachi/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hachi/ui";
import { PanelField } from "./panel-field";

interface ConfigProps {
  config: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}

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
      <Select value={(config.model as string) ?? "gpt-4-turbo"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
          <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
          <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Max Tokens" hint="Maximum tokens for hypothetical document">
      <Input
        type="number"
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
      <Select value={(config.model as string) ?? "text-embedding-3-small"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
          <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
          <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Dimensions" hint="Output vector dimensions">
      <Input
        type="number"
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
      <Input
        type="number"
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
      <Input
        type="text"
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
      <Input
        type="number"
        value={(config.topN as number) ?? 3}
        min={1}
        max={100}
        onChange={(e) => onUpdate("topN", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="Model">
      <Select value={(config.model as string) ?? "cross-encoder/ms-marco"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="cross-encoder/ms-marco">cross-encoder/ms-marco</SelectItem>
          <SelectItem value="cohere-rerank-v3">cohere-rerank-v3</SelectItem>
          <SelectItem value="bge-reranker-large">bge-reranker-large</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
  </>
);

// --- Judge ---
export const JudgeConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Criteria">
      <Select value={(config.criteria as string) ?? "relevance"} onValueChange={(v) => onUpdate("criteria", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="accuracy">Accuracy</SelectItem>
          <SelectItem value="completeness">Completeness</SelectItem>
        </SelectContent>
      </Select>
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
      <Select value={(config.model as string) ?? "gpt-4-turbo"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
          <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
          <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
        </SelectContent>
      </Select>
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
      <Input
        type="number"
        value={(config.maxTokens as number) ?? 1024}
        min={1}
        max={128000}
        onChange={(e) => onUpdate("maxTokens", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="System Prompt">
      <Textarea
        className="min-h-[60px] resize-y"
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
        <Select value={(config.model as string) ?? "gpt-4-turbo"} onValueChange={(v) => onUpdate("model", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
            <SelectItem value="gpt-4o">gpt-4o</SelectItem>
            <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
            <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
          </SelectContent>
        </Select>
      </PanelField>
      <PanelField label="Max Iterations">
        <Input
          type="number"
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
          <Input
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

// --- Fusion ---
export const FusionConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Method" hint="Fusion algorithm for merging result sets">
      <Select value={(config.method as string) ?? "rrf"} onValueChange={(v) => onUpdate("method", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rrf">Reciprocal Rank Fusion</SelectItem>
          <SelectItem value="combsum">CombSUM</SelectItem>
          <SelectItem value="combmnz">CombMNZ</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="K" hint="RRF ranking constant">
      <Input
        type="number"
        value={(config.k as number) ?? 60}
        min={1}
        max={1000}
        onChange={(e) => onUpdate("k", Number(e.target.value))}
      />
    </PanelField>
    <PanelField label="Sources" hint="Number of input result sets to fuse">
      <Input
        type="number"
        value={(config.sources as number) ?? 2}
        min={2}
        max={10}
        onChange={(e) => onUpdate("sources", Number(e.target.value))}
      />
    </PanelField>
  </>
);

// --- Router ---
export const RouterConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Strategy" hint="How to route queries to branches">
      <Select value={(config.strategy as string) ?? "complexity"} onValueChange={(v) => onUpdate("strategy", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="complexity">Complexity</SelectItem>
          <SelectItem value="topic">Topic</SelectItem>
          <SelectItem value="intent">Intent</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Model">
      <Select value={(config.model as string) ?? "gpt-4o-mini"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
          <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
          <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
          <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Branches" hint="Number of output routing branches">
      <Input
        type="number"
        value={(config.branches as number) ?? 3}
        min={2}
        max={10}
        onChange={(e) => onUpdate("branches", Number(e.target.value))}
      />
    </PanelField>
  </>
);

// --- Query Rewriter ---
export const QueryRewriterConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Strategy" hint="Query rewriting approach">
      <Select value={(config.strategy as string) ?? "step-back"} onValueChange={(v) => onUpdate("strategy", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="step-back">Step-Back</SelectItem>
          <SelectItem value="decompose">Decompose</SelectItem>
          <SelectItem value="expand">Expand</SelectItem>
          <SelectItem value="rephrase">Rephrase</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Model">
      <Select value={(config.model as string) ?? "gpt-4-turbo"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
          <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
          <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Max Variants" hint="Maximum query variants to generate">
      <Input
        type="number"
        value={(config.maxVariants as number) ?? 1}
        min={1}
        max={10}
        onChange={(e) => onUpdate("maxVariants", Number(e.target.value))}
      />
    </PanelField>
  </>
);

// --- Context Compressor ---
export const ContextCompressorConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Method" hint="Compression algorithm">
      <Select value={(config.method as string) ?? "llmlingua"} onValueChange={(v) => onUpdate("method", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="llmlingua">LLMLingua</SelectItem>
          <SelectItem value="selective-context">Selective Context</SelectItem>
          <SelectItem value="extractive">Extractive</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Compression Ratio">
      <Select value={(config.ratio as string) ?? "10x"} onValueChange={(v) => onUpdate("ratio", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="5x">5x</SelectItem>
          <SelectItem value="10x">10x</SelectItem>
          <SelectItem value="20x">20x</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Model">
      <Select value={(config.model as string) ?? "gpt-4o-mini"} onValueChange={(v) => onUpdate("model", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
          <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
          <SelectItem value="claude-3-sonnet">claude-3-sonnet</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
  </>
);

// --- Context Optimizer ---
export const ContextOptimizerConfig = ({ config, onUpdate }: ConfigProps) => (
  <PanelField label="Strategy" hint="How to reorder context for optimal LLM consumption">
    <Select value={(config.strategy as string) ?? "relevance-first"} onValueChange={(v) => onUpdate("strategy", v)}>
      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance-first">Relevance First</SelectItem>
        <SelectItem value="diversity">Diversity</SelectItem>
        <SelectItem value="recency">Recency</SelectItem>
        <SelectItem value="lost-in-middle">Lost-in-Middle Mitigation</SelectItem>
      </SelectContent>
    </Select>
  </PanelField>
);

// --- Web Search ---
export const WebSearchConfig = ({ config, onUpdate }: ConfigProps) => (
  <>
    <PanelField label="Provider">
      <Select value={(config.provider as string) ?? "tavily"} onValueChange={(v) => onUpdate("provider", v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="tavily">Tavily</SelectItem>
          <SelectItem value="serper">Serper</SelectItem>
          <SelectItem value="brave">Brave</SelectItem>
          <SelectItem value="bing">Bing</SelectItem>
        </SelectContent>
      </Select>
    </PanelField>
    <PanelField label="Max Results" hint="Maximum search results to return">
      <Input
        type="number"
        value={(config.maxResults as number) ?? 3}
        min={1}
        max={20}
        onChange={(e) => onUpdate("maxResults", Number(e.target.value))}
      />
    </PanelField>
  </>
);

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
  fusion: FusionConfig,
  router: RouterConfig,
  queryRewriter: QueryRewriterConfig,
  contextCompressor: ContextCompressorConfig,
  contextOptimizer: ContextOptimizerConfig,
  webSearch: WebSearchConfig,
};
