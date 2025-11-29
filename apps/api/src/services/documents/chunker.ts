import { MDocument } from "@mastra/rag";

/**
 * Chunk configuration options
 */
export interface ChunkOptions {
  /** Target chunk size in characters */
  chunkSize?: number;
  /** Overlap between chunks in characters */
  chunkOverlap?: number;
  /** Strategy for chunking */
  strategy?: "recursive" | "markdown" | "sentence";
}

/**
 * A document chunk with metadata
 */
export interface DocumentChunk {
  /** Unique chunk identifier */
  id: string;
  /** The chunk text content */
  content: string;
  /** Original document ID */
  documentId: string;
  /** Chunk index within the document */
  chunkIndex: number;
  /** Character offset in original document */
  startOffset: number;
  /** Character length of chunk */
  length: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Default chunk configuration
 */
const DEFAULT_CHUNK_OPTIONS: Required<ChunkOptions> = {
  chunkSize: 1000,
  chunkOverlap: 200,
  strategy: "recursive",
};

/**
 * Chunk a document into smaller pieces using Mastra's MDocument
 */
export const chunkDocument = async (
  documentId: string,
  content: string,
  options: ChunkOptions = {}
): Promise<DocumentChunk[]> => {
  const config = { ...DEFAULT_CHUNK_OPTIONS, ...options };

  // Create MDocument instance
  const doc = MDocument.fromText(content);

  // Chunk using the specified strategy
  let chunks: { text: string; metadata: Record<string, unknown> }[];

  switch (config.strategy) {
    case "markdown":
      chunks = await doc.chunk({
        strategy: "markdown",
        size: config.chunkSize,
        overlap: config.chunkOverlap,
      });
      break;
    case "sentence":
      // Sentence strategy uses maxSize instead of size
      chunks = await doc.chunk({
        strategy: "sentence",
        maxSize: config.chunkSize,
        overlap: config.chunkOverlap,
      });
      break;
    case "recursive":
    default:
      chunks = await doc.chunk({
        strategy: "recursive",
        size: config.chunkSize,
        overlap: config.chunkOverlap,
      });
      break;
  }

  // Transform to DocumentChunk format
  let currentOffset = 0;
  return chunks.map((chunk, index) => {
    const startOffset = content.indexOf(chunk.text, currentOffset);
    currentOffset = startOffset >= 0 ? startOffset : currentOffset;

    return {
      id: `${documentId}-chunk-${index}`,
      content: chunk.text,
      documentId,
      chunkIndex: index,
      startOffset: currentOffset,
      length: chunk.text.length,
      metadata: chunk.metadata,
    };
  });
};

/**
 * Detect document type from filename or content
 */
export const detectDocumentType = (
  filename: string,
  content?: string
): "markdown" | "text" | "html" | "unknown" => {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "md":
    case "markdown":
      return "markdown";
    case "txt":
      return "text";
    case "html":
    case "htm":
      return "html";
    default:
      // Try to detect from content
      if (content) {
        if (content.includes("<!DOCTYPE html") || content.includes("<html")) {
          return "html";
        }
        if (content.includes("# ") || content.includes("## ")) {
          return "markdown";
        }
      }
      return "unknown";
  }
};

/**
 * Get recommended chunk strategy based on document type
 */
export const getRecommendedStrategy = (
  docType: ReturnType<typeof detectDocumentType>
): ChunkOptions["strategy"] => {
  switch (docType) {
    case "markdown":
      return "markdown";
    case "html":
      return "recursive";
    case "text":
    default:
      return "sentence";
  }
};

/**
 * Process a document: detect type, chunk, and return chunks
 */
export const processDocument = async (
  documentId: string,
  filename: string,
  content: string,
  options?: ChunkOptions
): Promise<{
  documentType: ReturnType<typeof detectDocumentType>;
  chunks: DocumentChunk[];
  totalChunks: number;
  totalCharacters: number;
}> => {
  const documentType = detectDocumentType(filename, content);
  const strategy = options?.strategy || getRecommendedStrategy(documentType);

  const chunks = await chunkDocument(documentId, content, {
    ...options,
    strategy,
  });

  return {
    documentType,
    chunks,
    totalChunks: chunks.length,
    totalCharacters: content.length,
  };
};
