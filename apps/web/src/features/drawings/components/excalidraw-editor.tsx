"use client";

import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

interface InnerProps {
  initialData?: ExcalidrawInitialDataState;
  onChange?: (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => void;
  apiRef: React.RefObject<ExcalidrawImperativeAPI | null>;
}

const ExcalidrawInner = dynamic(
  async () => {
    const { Excalidraw, MainMenu, WelcomeScreen, THEME } = await import("@excalidraw/excalidraw");

    function Inner({ initialData, onChange, apiRef }: InnerProps) {
      return (
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
            (apiRef as React.MutableRefObject<ExcalidrawImperativeAPI | null>).current = api;
          }}
          initialData={initialData}
          onChange={onChange}
          theme={THEME.DARK}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
              saveAsImage: true,
              export: { saveFileToDisk: true },
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.Separator />
            <MainMenu.ItemLink href="/drawings">
              Back to Drawings
            </MainMenu.ItemLink>
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>
                Start drawing or pick a tool from the toolbar
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.MenuHint />
          </WelcomeScreen>
        </Excalidraw>
      );
    }

    return Inner;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

interface ExcalidrawEditorProps {
  initialData?: ExcalidrawInitialDataState;
  onChange?: (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => void;
}

export function ExcalidrawEditor({ initialData, onChange }: ExcalidrawEditorProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      onChange?.(elements, appState, files);
    },
    [onChange]
  );

  return (
    <div className="h-full w-full">
      <ExcalidrawInner
        initialData={initialData}
        onChange={handleChange}
        apiRef={apiRef}
      />
    </div>
  );
}
