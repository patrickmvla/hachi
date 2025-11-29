"use client";

import { useState, useCallback, useMemo } from "react";
import { Panel, useReactFlow, useNodes, type Node, type PanelPosition } from "@xyflow/react";
import { Search, X } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import type { HachiNode } from "@/stores/canvas-store";

interface NodeSearchProps {
  position?: PanelPosition;
  className?: string;
  placeholder?: string;
  onSearch?: (searchString: string) => HachiNode[];
  onSelectNode?: (node: HachiNode) => void;
}

/**
 * A search component for finding and selecting nodes
 */
export const NodeSearch = ({
  position = "top-left",
  className,
  placeholder = "Search nodes...",
  onSearch,
  onSelectNode,
}: NodeSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const nodes = useNodes<HachiNode>();
  const { setCenter, getNode } = useReactFlow();

  // Default search function
  const defaultSearch = useCallback(
    (searchString: string): HachiNode[] => {
      if (!searchString.trim()) return [];
      const lowerSearch = searchString.toLowerCase();
      return nodes.filter(
        (node) =>
          node.data?.label?.toLowerCase().includes(lowerSearch) ||
          node.data?.type?.toLowerCase().includes(lowerSearch) ||
          node.id.toLowerCase().includes(lowerSearch)
      );
    },
    [nodes]
  );

  // Default select handler
  const defaultSelectNode = useCallback(
    (node: HachiNode) => {
      const nodeData = getNode(node.id);
      if (nodeData) {
        const x = nodeData.position.x + (nodeData.measured?.width ?? 100) / 2;
        const y = nodeData.position.y + (nodeData.measured?.height ?? 50) / 2;
        setCenter(x, y, { zoom: 1.5, duration: 500 });
      }
    },
    [getNode, setCenter]
  );

  const searchFn = onSearch ?? defaultSearch;
  const selectFn = onSelectNode ?? defaultSelectNode;

  const results = useMemo(
    () => searchFn(searchValue),
    [searchFn, searchValue]
  );

  const handleSelect = (node: HachiNode) => {
    selectFn(node);
    setSearchValue("");
    setIsOpen(false);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchValue("");
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearchValue("");
    setSelectedIndex(0);
  };

  return (
    <Panel position={position} className={cn("!m-2", className)}>
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg min-w-[200px]">
          <Search size={14} className="text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSelectedIndex(0);
              setIsOpen(true);
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg max-h-[200px] overflow-auto z-50">
            {results.map((node, index) => (
              <button
                key={node.id}
                onClick={() => handleSelect(node)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                  index === selectedIndex
                    ? "bg-[var(--muted)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
                )}
              >
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-mono uppercase">
                  {node.data?.type || node.type}
                </span>
                <span className="truncate">{node.data?.label || node.id}</span>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isOpen && searchValue && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg p-3 text-center text-sm text-[var(--muted-foreground)]">
            No nodes found
          </div>
        )}
      </div>
    </Panel>
  );
};
