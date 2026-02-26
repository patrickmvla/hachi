import { useCallback, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { getNodeDefaults } from "@/features/canvas/config/node-defaults";
import { nodeRegistry } from "../config/node-registry";
import { usePlaygroundStore, type PlaygroundNode } from "../store/playground-store";

export function usePlaygroundDnd() {
  const addNode = usePlaygroundStore((s) => s.addNode);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/playground-node-type");
      if (!nodeType || !nodeRegistry[nodeType]) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const registry = nodeRegistry[nodeType];
      const newNode: PlaygroundNode = {
        id: crypto.randomUUID(),
        type: nodeType,
        position,
        data: {
          label: registry.label,
          type: nodeType,
          config: { ...getNodeDefaults(nodeType) },
          status: "initial",
        },
      };

      addNode(newNode);
    },
    [addNode, reactFlowInstance]
  );

  return { reactFlowWrapper, onDragOver, onDrop };
}
