// Document Chunker
export {
  chunkDocument,
  detectDocumentType,
  getRecommendedStrategy,
  processDocument,
  type ChunkOptions,
  type DocumentChunk,
} from "./chunker";

// Document Embedder
export {
  embedText,
  embedTexts,
  embedChunks,
  embedQuery,
  cosineSimilarity,
  searchInMemory,
  type EmbedOptions,
  type EmbeddedChunk,
} from "./embedder";

// Vector Search
export {
  searchDocuments,
  hybridSearch,
  getDocumentsByIds,
  countDocuments,
  countEmbeddedDocuments,
  type SearchOptions,
  type SearchResult,
} from "./search";
