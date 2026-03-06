# Hachi Research: RAG Papers from ArXiv

**Research Date:** March 2026
**Scope:** Foundational papers, advanced techniques, architecture patterns, surveys, benchmarks, and paradigm shifts — mapped to visual pipeline builder design

---

## Table of Contents

1. [Evolution Timeline](#1-evolution-timeline)
2. [Foundational Papers](#2-foundational-papers)
3. [Query Enhancement Techniques](#3-query-enhancement-techniques)
4. [Retrieval Improvements](#4-retrieval-improvements)
5. [Reranking](#5-reranking)
6. [Context Optimization](#6-context-optimization)
7. [Iterative & Multi-Hop RAG](#7-iterative--multi-hop-rag)
8. [Agentic RAG](#8-agentic-rag)
9. [Graph RAG](#9-graph-rag)
10. [Multimodal & Specialized RAG](#10-multimodal--specialized-rag)
11. [Surveys & Taxonomies](#11-surveys--taxonomies)
12. [Evaluation & Benchmarks](#12-evaluation--benchmarks)
13. [Paradigm Shifts (2024-2026)](#13-paradigm-shifts-2024-2026)
14. [RAG Failure Modes & Debugging](#14-rag-failure-modes--debugging)
15. [Implications for Hachi](#15-implications-for-hachi)
16. [Paper Index](#16-paper-index)

---

## 1. Evolution Timeline

| Year | Paper | Key Innovation |
|------|-------|----------------|
| 2019 | kNN-LM | Token-level retrieval augmentation via nearest neighbors |
| 2020 | REALM | Unsupervised retriever pre-training via masked language modeling |
| 2020 | DPR | Dense dual-encoder retrieval with contrastive learning |
| 2020 | RAG (Lewis et al.) | Named the paradigm; end-to-end retriever + generator with latent retrieval |
| 2020 | ColBERT | Late interaction retrieval — token-level matching at bi-encoder speed |
| 2021 | FiD | Independent passage encoding with decoder fusion |
| 2022 | RETRO | Chunked cross-attention over trillions of tokens; parameter efficiency |
| 2022 | HyDE | Query augmentation via hypothetical document generation |
| 2022 | Atlas | Few-shot learning via joint retriever-generator training |
| 2022 | IRCoT | Interleaved retrieval with chain-of-thought reasoning |
| 2022 | ReAct | Reasoning + Acting — foundational agentic pattern |
| 2023 | REPLUG | Black-box LM augmentation; LM-supervised retrieval |
| 2023 | FLARE | Active retrieval triggered by generation uncertainty |
| 2023 | Toolformer | Self-supervised tool-use learning |
| 2023 | Self-RAG | Self-reflective retrieval with inline reflection tokens |
| 2023 | Lost in the Middle | Position bias in LLM context windows |
| 2023 | LLMLingua | Prompt compression for RAG contexts |
| 2023 | RAGAS | Standard RAG evaluation framework |
| 2024 | CRAG | Corrective retrieval with evaluator and web search fallback |
| 2024 | Adaptive-RAG | Query complexity routing to different retrieval strategies |
| 2024 | RAPTOR | Recursive tree-structured indexing with multi-level summarization |
| 2024 | GraphRAG | Knowledge graph + community detection for global sensemaking |
| 2024 | Modular RAG | LEGO-like reconfigurable RAG framework |
| 2024 | Speculative RAG | Parallel draft-then-verify with specialist/generalist split |
| 2024 | Late Chunking | Chunk after encoding for contextual embeddings |
| 2024 | VisRAG | Vision-first RAG treating pages as images |
| 2024 | CAG | Cache-augmented generation — preload, no retrieval |
| 2025 | RAGSmith | Genetic algorithm optimization of RAG configurations |
| 2026 | A-RAG | Hierarchical retrieval interfaces for scaling agentic RAG |
| 2026 | PruneRAG | Confidence-guided query decomposition trees |

**Three clear evolutionary trends:**
1. **Static → Adaptive retrieval:** Early systems retrieved once; modern systems decide when, whether, and how much to retrieve dynamically
2. **Separate → Jointly-trained components:** From frozen retrievers to end-to-end trained retriever-generator pairs
3. **Naive concatenation → Quality-aware integration:** From blindly appending text to evaluating, filtering, and selectively incorporating retrieved information

---

## 2. Foundational Papers

### 2.1 RAG — The Paper That Named the Paradigm

**Title:** Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
**ArXiv:** [2005.11401](https://arxiv.org/abs/2005.11401)
**Authors:** Patrick Lewis et al. (Facebook AI Research / UCL / NYU)
**Date:** May 2020 (NeurIPS 2020)

**Core contribution:** Coined "RAG." Combined parametric memory (BART seq2seq) with non-parametric memory (DPR retriever over Wikipedia). Retrieval is a latent variable marginalized during generation.

**Two variants:**
- **RAG-Sequence:** Same retrieved documents condition the entire output. Marginalizes at sequence level.
- **RAG-Token:** Different documents can inform each generated token. Marginalizes at token level.

**Pipeline flow:**
```
Query → DPR Retriever → top-k docs from Wikipedia → BART Generator (conditioned on query + docs) → Marginalize across docs → Output
```

**Key results:** SOTA on Natural Questions, TriviaQA, WebQuestions. More specific, diverse, and factual generation than parametric-only baselines.

**For Hachi:** This is the atomic pattern. Every RAG pipeline starts here: Query → Retrieve → Generate. The most basic template.

---

### 2.2 REALM — Learned Retrieval

**Title:** REALM: Retrieval-Augmented Language Model Pre-Training
**ArXiv:** [2002.08909](https://arxiv.org/abs/2002.08909)
**Authors:** Kelvin Guu et al. (Google Research)
**Date:** February 2020 (ICML 2020)

**Core contribution:** First to show a retriever can be pre-trained in a fully unsupervised way using masked language modeling as the learning signal. If retrieving a document helps predict masked tokens, that document is relevant — backpropagate through retrieval to train the retriever.

**Key innovation:** Asynchronous index refresh during pre-training. As retriever embeddings change, the MIPS index must be periodically rebuilt.

**Key results:** Outperformed all previous methods on Open-QA by 4-16% absolute accuracy.

**For Hachi:** Established that the retriever should be learned jointly with the generator, not frozen. Motivates fine-tuning options on retriever nodes.

---

### 2.3 DPR — Dense Passage Retrieval

**Title:** Dense Passage Retrieval for Open-Domain Question Answering
**ArXiv:** [2004.04906](https://arxiv.org/abs/2004.04906)
**Authors:** Vladimir Karpukhin et al. (Facebook AI Research)
**Date:** April 2020 (EMNLP 2020)

**Core contribution:** Proved that simple dense representations from a dual-encoder BERT framework dramatically outperform BM25/TF-IDF for open-domain QA. This was the watershed moment for dense retrieval.

**Architecture:**
```
Question → BERT Question Encoder → query embedding (q)
Passage  → BERT Passage Encoder  → passage embedding (p)
Similarity = dot_product(q, p)
Training: contrastive loss with hard negatives + in-batch negatives
Inference: FAISS index for approximate nearest neighbor search
```

**Key results:** Outperformed BM25 by 9-19% absolute on top-20 retrieval accuracy.

**For Hachi:** DPR is the retrieval backbone the original RAG paper used. Every embedding model today (OpenAI, Cohere, E5, BGE) follows this paradigm. The `embedding` and `retriever` nodes implement DPR's pattern.

---

### 2.4 RETRO — Retrieval at Trillion Scale

**Title:** Improving Language Models by Retrieving from Trillions of Tokens
**ArXiv:** [2112.04426](https://arxiv.org/abs/2112.04426)
**Authors:** Sebastian Borgeaud et al. (DeepMind, 28 authors)
**Date:** December 2021 (ICML 2022)

**Core contribution:** Retrieval augmentation at 2 trillion token scale. A 7.5B parameter RETRO matched GPT-3 (175B) and Jurassic-1 (178B) — 25x fewer parameters. Introduced "chunked cross-attention" (CCA) where the model attends to retrieved neighbors at regular intervals throughout generation.

**Key insight:** Input split into ~64 token chunks. Each chunk retrieves neighbors from a massive database. CCA layers are interleaved with standard self-attention. Retrieval uses the *previous* chunk's neighbors (causal — no future leakage).

**For Hachi:** Demonstrates that retrieval database size matters enormously. Chunked retrieval is more practical than single-query retrieval for long contexts. Smaller models + better retrieval can match much larger models.

---

### 2.5 Atlas — Few-Shot RAG

**Title:** Atlas: Few-shot Learning with Retrieval Augmented Language Models
**ArXiv:** [2208.03299](https://arxiv.org/abs/2208.03299)
**Authors:** Gautier Izacard et al. (Meta AI)
**Date:** August 2022 (JMLR 2023)

**Core contribution:** RAG models as exceptional few-shot learners. 11B parameters + 64 examples outperformed PaLM (540B). Thorough investigation of joint retriever-generator training: Attention Distillation and Perplexity Distillation work best.

**Architecture:** Uses Fusion-in-Decoder (FiD) on T5 — each passage independently encoded, all encoder outputs concatenated, decoder cross-attends over all.

**For Hachi:** The retriever should find documents that actually help the generator produce correct outputs (not just "relevant" documents). FiD is superior to simple concatenation for aggregating multiple passages.

---

### 2.6 Fusion-in-Decoder (FiD)

**Title:** Leveraging Passage Retrieval with Generative Models for Open Domain Question Answering
**ArXiv:** [2007.01282](https://arxiv.org/abs/2007.01282)
**Authors:** Gautier Izacard, Edouard Grave (Facebook AI)
**Date:** July 2020 (EACL 2021)

**Core contribution:** Encode each retrieved passage independently (concatenated with question), concatenate all encoder outputs, let decoder cross-attend over everything. Scales efficiently to 100+ passages.

**For Hachi:** FiD became the standard generator architecture in many RAG systems. Performance improved significantly from 10 to 100 passages — more context helps if the generator can handle it.

---

### 2.7 kNN-LM — Token-Level Retrieval

**Title:** Generalization through Memorization: Nearest Neighbor Language Models
**ArXiv:** [1911.00172](https://arxiv.org/abs/1911.00172)
**Authors:** Urvashi Khandelwal et al. (Stanford / Facebook AI)
**Date:** November 2019 (ICLR 2020)

**Core contribution:** Augment a pre-trained LM by interpolating its next-token predictions with a kNN lookup over a datastore of cached (context, next-token) pairs. No additional training needed — build datastore offline, interpolate at inference.

**Key results:** 2.9 point perplexity improvement on Wikitext-103 with no training. Effective domain adaptation by simply swapping the datastore.

**For Hachi:** Established that retrieval at token level (not just query level) can dramatically improve outputs. The LM's own representations are excellent retrieval keys.

---

### 2.8 REPLUG — Black-Box RAG

**Title:** REPLUG: Retrieval-Augmented Black-Box Language Models
**ArXiv:** [2301.12652](https://arxiv.org/abs/2301.12652)
**Authors:** Weijia Shi et al. (UW / Meta AI)
**Date:** January 2023

**Core contribution:** RAG that works with black-box LMs (no access to weights/architecture). Simply prepend retrieved docs to the input. REPLUG LSR uses the LM's own perplexity to train the retriever.

**Key results:** Improved GPT-3 by 6.3% on language modeling and Codex by 5.1% on MMLU.

**For Hachi:** This is how most production RAG systems work today — frozen LLM (GPT-4, Claude) with retrieved context prepended. Validates the approach Hachi implements.

---

## 3. Query Enhancement Techniques

### 3.1 HyDE — Hypothetical Document Embeddings

**ArXiv:** [2212.10496](https://arxiv.org/abs/2212.10496)
**Authors:** Luyu Gao et al. (CMU)
**Date:** December 2022 (ACL 2023)

**Technique:** Instead of embedding the raw query, use an LLM to generate a "hypothetical document" that would answer the query, then embed *that* for retrieval. The encoder's dense bottleneck naturally filters out hallucinated details.

```
Query: "What is the capital of France?"
  → LLM generates: "The capital of France is Paris. Paris is the largest city..."
  → Embed hypothetical document
  → Retrieve real documents near this embedding
```

**Results:** Matches fine-tuned retrievers in zero-shot settings across web search, QA, and fact verification. Multilingual.

**Hachi node:** `hyde` — sits between Query and Retriever. Already implemented.

---

### 3.2 Query2Doc — Query Expansion

**ArXiv:** [2303.07678](https://arxiv.org/abs/2303.07678)
**Authors:** Liang Wang et al.
**Date:** March 2023 (EMNLP 2023)

**Technique:** LLM generates pseudo-documents via few-shot prompting. Unlike HyDE (which replaces the query), Query2Doc *appends* generated content to the original query. Works for both sparse (BM25) and dense retrieval.

**Results:** 3-15% boost on MS-MARCO and TREC DL without any fine-tuning.

**Hachi node:** Query Expansion node — enriches queries before retrieval. Particularly useful for BM25.

---

### 3.3 Step-Back Prompting

**ArXiv:** [2310.06117](https://arxiv.org/abs/2310.06117)
**Authors:** Huaixiu Steven Zheng et al. (Google DeepMind)
**Date:** October 2023

**Technique:** Before answering a detailed question, generate a higher-level "step-back question." Retrieve for both original and abstract queries. Provides both specific and foundational context.

```
Original: "What happens to pressure when temperature increases in a sealed container?"
Step-back: "What are the principles of gas behavior?"
→ Retrieve for both → Merge context → Generate
```

**Results:** +7% on MMLU Physics, +11% Chemistry, +27% TimeQA.

**Hachi pattern:** Branching pipeline — Query → [Original Retriever | Step-Back LLM → Step-Back Retriever] → Merge → LLM.

---

### 3.4 RAG-Fusion — Multi-Query + RRF

**ArXiv:** [2402.03367](https://arxiv.org/abs/2402.03367)
**Authors:** Zackary Rackauckas
**Date:** January 2024

**Technique:** LLM generates multiple variant queries from different perspectives. Each variant retrieves independently. Results merged via Reciprocal Rank Fusion (RRF).

```
Query → Multi-Query LLM → [Query A, Query B, Query C]
  → [Retriever A, Retriever B, Retriever C] (parallel)
  → RRF Fusion → Reranked results → LLM Generate
```

**Hachi pattern:** Fan-out/fan-in — compelling visual workflow showing parallel retrieval paths converging at a fusion node.

---

### 3.5 DMQR-RAG — Diverse Multi-Query Rewriting

**ArXiv:** [2411.13154](https://arxiv.org/abs/2411.13154)
**Date:** November 2024

**Technique:** Four diverse rewriting strategies at different information levels (keyword, sentence, document, abstraction) with adaptive strategy selection that minimizes unnecessary rewrites.

**Hachi node:** Sophisticated Query Rewriter with configurable strategy selection.

---

### 3.6 PruneRAG — Query Decomposition Trees (2026)

**ArXiv:** [2601.11024](https://arxiv.org/abs/2601.11024)
**Date:** January 2026

**Technique:** Builds structured query decomposition trees for multi-hop reasoning. Adaptive node expansion, confidence-guided pruning of uncertain branches, fine-grained entity-level anchor extraction. Introduces "Evidence Forgetting Rate" metric.

**Hachi pattern:** Tree-structured sub-pipeline with branching query paths and confidence scores at each node. Represents the cutting edge of query decomposition.

---

## 4. Retrieval Improvements

### 4.1 ColBERT / ColBERTv2 — Late Interaction

**ColBERT ArXiv:** [2004.12832](https://arxiv.org/abs/2004.12832) (April 2020, SIGIR 2020)
**ColBERTv2 ArXiv:** [2112.01488](https://arxiv.org/abs/2112.01488) (December 2021, NAACL 2022)
**Authors:** Omar Khattab, Matei Zaharia (Stanford)

**Technique:** Independently encode queries and documents into per-token embeddings. At retrieval: for each query token, find max similarity with any document token, sum these. "Late interaction" — fine-grained matching at bi-encoder speed.

**ColBERTv2 improvement:** Residual compression (6-10x storage reduction) + denoised supervision (cross-encoder scores as training signal).

**Results:** Competitive with full cross-encoders, 2 orders of magnitude faster, up to 4 orders of magnitude fewer FLOPs.

**Hachi node:** ColBERT Retriever — sweet spot between bi-encoder speed and cross-encoder quality.

---

### 4.2 Hybrid Search + Fusion

**Analysis of Fusion Functions ArXiv:** [2210.11934](https://arxiv.org/abs/2210.11934) (October 2022)
**DAT (Dynamic Alpha Tuning) ArXiv:** [2503.23013](https://arxiv.org/abs/2503.23013) (March 2025)

**Key findings:** Convex Combination (CC) of normalized scores outperforms RRF for hybrid search. DAT goes further — uses LLM to evaluate top-1 results from both BM25 and dense retrieval, dynamically calibrating the weighting per query.

**RRF formula:** For each document d: score = Σ 1/(k + rank(d)) across all rankers (k=60 typically).

**Hachi node:** Hybrid Search node accepting inputs from both BM25 and Dense Retriever nodes, with configurable fusion strategy (RRF, CC, or DAT-style adaptive).

---

### 4.3 Contextual Retrieval (Anthropic)

**Source:** Anthropic blog, September 2024

**Technique:** Before embedding each chunk, an LLM generates a short contextual description explaining the chunk's role in the full document. This context is prepended before both embedding and BM25 indexing.

```
Chunk: "Revenue grew 15% YoY driven by APAC expansion"
Context: "This chunk is from the Q3 2024 earnings report, section on regional revenue breakdown"
Indexed as: context + chunk
```

**Results:** 49% reduction in top-20-chunk retrieval failure rate.

**Hachi node:** Contextual Chunker node in document ingestion pipeline.

---

### 4.4 Late Chunking

**ArXiv:** [2409.04701](https://arxiv.org/abs/2409.04701)
**Authors:** Michael Gunther et al. (Jina AI)
**Date:** September 2024

**Technique:** Reverse the traditional approach. Instead of chunk → embed, do: embed entire document through a long-context model → then chunk the token embeddings. Each chunk embedding inherently contains context from surrounding text because the transformer attended to the full document.

```
Traditional: Document → Chunk → Embed each chunk independently
Late Chunking: Document → Long-Context Embedding Model → Chunk the token embeddings → Mean pool per chunk
```

**Results:** Superior retrieval with no additional training. More efficient than Contextual Retrieval (no extra LLM call per chunk).

**Hachi node:** Alternative Embedding node that processes whole documents first, then chunks.

---

### 4.5 BGE M3-Embedding — Multi-Vector Retrieval

**ArXiv:** [2402.03216](https://arxiv.org/abs/2402.03216)
**Authors:** Jianlv Chen et al. (BAAI)
**Date:** February 2024

**Technique:** Single model producing three representation types simultaneously: dense single-vector, sparse lexical weights (SPLADE-like), and multi-vector ColBERT-style token embeddings. Self-knowledge distillation integrates all three. 100+ languages, up to 8,192 tokens.

**Hachi node:** M3 Embedding node that outputs to multiple retriever types from one model, simplifying hybrid search pipelines.

---

### 4.6 Hierarchical / Parent-Child Retrieval

**HiChunk ArXiv:** [2509.11552](https://arxiv.org/abs/2509.11552) (September 2025)
**Hierarchical Text Segmentation ArXiv:** [2507.09935](https://arxiv.org/abs/2507.09935) (July 2025)

**Technique:** Multi-level document structuring. Retrieve at fine granularity (sentence/paragraph) but auto-merge adjacent chunks up to parent level when multiple children from the same parent are retrieved, providing better context.

**Hachi pattern:** Document → Hierarchical Chunker → [Child Index + Parent Store] → Retriever (with auto-merge).

---

## 5. Reranking

### 5.1 Cross-Encoder Reranking (BGE Reranker)

**ArXiv:** [2309.07597](https://arxiv.org/abs/2309.07597)
**Authors:** Shitao Xiao et al. (BAAI)
**Date:** September 2023

**Technique:** Unlike embedding models that independently encode query and document, cross-encoders take the concatenation [query; document] as input and produce a single relevance score through full attention over the pair. Much more accurate but slower.

**MICE (2026) ArXiv:** [2602.16299](https://arxiv.org/abs/2602.16299) — Minimal-interaction cross-encoders achieve same quality at 4x speed.

**Hachi node:** `reranker` — sits between retriever and LLM. Users choose between speed (MICE) and accuracy (full cross-encoder).

---

### 5.2 RankGPT — Listwise LLM Reranking

**ArXiv:** [2304.09542](https://arxiv.org/abs/2304.09542)
**Authors:** Weiwei Sun et al.
**Date:** April 2023 (EMNLP 2023 Outstanding Paper Award)

**Technique:** LLM outputs a permutation of passage identifiers ordered by relevance. Sliding window strategy handles lists longer than context window. Considers all passages simultaneously (listwise) rather than scoring independently.

**Results:** GPT-4 competitive with or superior to SOTA supervised methods. A distilled 440M model outperformed a 3B supervised model.

**Hachi node:** LLM Reranker variant — more expensive but more powerful than cross-encoder.

---

### 5.3 FIRST — Faster Listwise Reranking

**ArXiv:** [2406.15657](https://arxiv.org/abs/2406.15657)
**Date:** June 2024 (EMNLP 2024)

**Technique:** Uses output logits of the *first generated token* to obtain ranking. Each passage gets an identifier token; the model's probability distribution over these tokens provides the ranking in a single decoding step.

**Results:** 50% faster than standard listwise reranking with robust performance.

**Hachi node:** Fast LLM Reranker configuration.

---

### 5.4 Reranking Evolution Survey

**ArXiv:** [2512.16236](https://arxiv.org/abs/2512.16236) (December 2025)

Maps the full trajectory: heuristic methods → learning-to-rank → cross-encoders → LLM-based rerankers (pointwise, pairwise, listwise). Covers RankGPT, RankVicuna, RankZephyr, and FIRST.

**For Hachi:** Taxonomy for reranker node configurations — cross-encoder, pointwise LLM, pairwise LLM, listwise LLM.

---

## 6. Context Optimization

### 6.1 Lost in the Middle

**ArXiv:** [2307.03172](https://arxiv.org/abs/2307.03172)
**Authors:** Nelson F. Liu et al.
**Date:** July 2023 (TACL 2024)

**Finding:** Performance is highest when relevant information is at the beginning or end of the context. Significantly degrades when relevant info is in the middle. U-shaped performance curve holds across models.

**For Hachi:** Context assembly nodes should reorder documents to place most relevant at beginning and end. A "Context Optimizer" node applying this principle.

---

### 6.2 LLMLingua / LongLLMLingua — Prompt Compression

**LLMLingua ArXiv:** [2310.05736](https://arxiv.org/abs/2310.05736)
**LongLLMLingua ArXiv:** [2310.06839](https://arxiv.org/abs/2310.06839)
**Authors:** Huiqiang Jiang et al. (Microsoft)
**Date:** October 2023

**Technique:** Coarse-to-fine prompt compression using information-theoretic metrics. Budget Controller allocates compression ratios across segments. Token-level iterative compression uses perplexity from a small LM to identify redundant tokens.

**LongLLMLingua:** Query-aware compression for RAG — tokens more relevant to the query are preserved. Addresses Lost in the Middle by reordering compressed content.

**Results:** Up to 20x compression with minimal performance loss. 94% cost reduction on LooGLE benchmark.

**Hachi node:** Context Compressor between reranker and LLM. Reduces cost and latency.

---

### 6.3 RECOMP — Compression + Selective Augmentation

**ArXiv:** [2310.04408](https://arxiv.org/abs/2310.04408)
**Date:** October 2023 (ICLR 2024)

**Technique:** Extractive compressor (selects useful sentences) or abstractive compressor (generates concise summaries). Critically, both can return an empty string when documents are irrelevant — implementing selective augmentation.

**Results:** 6% compression rate with minimal performance loss.

**Hachi node:** Document Compressor with extractive/abstractive modes. The "return empty" feature aligns with the Judge node concept.

---

### 6.4 Selective Context

**ArXiv:** [2310.06201](https://arxiv.org/abs/2310.06201)
**Date:** October 2023 (EMNLP 2023)

**Technique:** Self-information-based pruning. Compute self-information (negative log probability) for each unit. Low self-information = highly predictable/redundant = prune.

**Results:** 50% context cost reduction, 36% memory reduction, 32% latency reduction.

**Hachi node:** Lightweight Context Pruner — simpler than LLMLingua, good for cost-sensitive deployments.

---

### 6.5 FILCO — Learning to Filter Context

**ArXiv:** [2311.08377](https://arxiv.org/abs/2311.08377)
**Date:** November 2023

**Technique:** Trained context filtering using lexical overlap and conditional cross-mutual information. Keeps only useful spans from retrieved passages.

**Hachi node:** Context Filter that removes irrelevant spans before they reach the generator. Reduces hallucination.

---

## 7. Iterative & Multi-Hop RAG

### 7.1 FLARE — Forward-Looking Active Retrieval

**ArXiv:** [2305.06983](https://arxiv.org/abs/2305.06983)
**Authors:** Zhengbao Jiang et al. (CMU / Meta AI)
**Date:** May 2023 (EMNLP 2023)

**Pattern:** LLM generates sentence-by-sentence. When it produces low-confidence tokens, it uses the tentative next sentence as a retrieval query, fetches documents, and regenerates.

```
Query → LLM generates draft sentence → Check token confidence
  → High confidence: accept, continue
  → Low confidence: use draft as query → Retriever → Regenerate with context
  → Repeat until complete
```

**For Hachi:** Loop with conditional retrieval. Requires cycle support in the execution engine (Mastra `.loop()`).

---

### 7.2 IRCoT — Interleaved Retrieval with Chain-of-Thought

**ArXiv:** [2212.10509](https://arxiv.org/abs/2212.10509)
**Authors:** Harsh Trivedi et al.
**Date:** December 2022 (ACL 2023)

**Pattern:** At each CoT step, generate one reasoning sentence, use it as retrieval query, fetch supporting docs, continue reasoning with updated context. Retrieval guides CoT and CoT guides retrieval.

**Results:** Up to +21 points retrieval quality, +15 points downstream QA on HotpotQA, MuSiQue.

**Hachi pattern:** Alternating Retriever-LLM chain iterated N times.

---

### 7.3 Iter-RetGen — Iterative Retrieval-Generation Synergy

**ArXiv:** [2305.15294](https://arxiv.org/abs/2305.15294)
**Date:** May 2023 (Findings of EMNLP 2023)

**Pattern:** LLM generates complete response → use response as enriched retrieval query → retrieve → generate improved response → repeat K rounds.

```
Query → Retriever → LLM (full response) → Query Reformulator (output + original query)
  → Retriever → LLM (improved response) → Repeat K rounds
```

**Hachi pattern:** Loop with generation-feedback. Configurable iteration count.

---

### 7.4 Self-RAG — Self-Reflective Retrieval

**ArXiv:** [2310.11511](https://arxiv.org/abs/2310.11511)
**Authors:** Akari Asai et al. (UW / IBM)
**Date:** October 2023 (ICLR 2024 Oral — Top 1%)

**Pattern:** Single LM with learned reflection tokens:
- `[Retrieve]` — should I retrieve? (yes/no)
- `[IsRel]` — is the passage relevant? (relevant/irrelevant)
- `[IsSup]` — is the output supported? (fully/partially/no support)
- `[IsUse]` — overall utility score (1-5)

Adaptively retrieves only when needed. Self-evaluates outputs. Controllable at inference via threshold tuning.

**Results:** 7B/13B Self-RAG outperformed ChatGPT and retrieval-augmented Llama2-chat.

**Hachi pattern:** Decision tree with multiple judge nodes. Maps to: LLM → [Retrieve Decision] → Retriever → [Relevance Check] → LLM → [Support Check] → Output.

---

### 7.5 CRAG — Corrective RAG

**ArXiv:** [2401.15884](https://arxiv.org/abs/2401.15884)
**Authors:** Shi-Qi Yan et al. (USTC / UCLA / Google DeepMind)
**Date:** January 2024

**Pattern:** Lightweight retrieval evaluator (~0.77B) scores document relevance → three actions:

```
Query → Retriever → Evaluator
  → CORRECT (high confidence): Decompose-Recompose Filter → LLM
  → AMBIGUOUS (medium): Filter + Web Search → Merge → LLM
  → INCORRECT (low): Web Search → LLM
```

**Key feature:** Plug-and-play with any existing RAG pipeline. Decompose-then-recompose filters irrelevant information from retrieved documents at fine-grained level.

**Hachi node:** Maps directly to `judge` node with three conditional branches. The CRAG template is one of Hachi's core reference architectures.

---

### 7.6 Adaptive-RAG — Complexity-Based Routing

**ArXiv:** [2403.14403](https://arxiv.org/abs/2403.14403)
**Authors:** Soyeong Jeong et al. (KAIST)
**Date:** March 2024 (NAACL 2024)

**Pattern:** Trained classifier routes queries by complexity:

```
Query → Complexity Classifier
  → Simple: LLM Direct (no retrieval)
  → Moderate: Single-step Retrieve → LLM
  → Complex: Multi-step Iterative Retrieve → LLM
```

**Hachi node:** Router node that classifies queries and routes to different pipeline branches.

---

### 7.7 RAPTOR — Tree-Structured Retrieval

**ArXiv:** [2401.18059](https://arxiv.org/abs/2401.18059)
**Authors:** Parth Sarthi et al.
**Date:** January 2024 (ICLR 2024)

**Pattern:** Recursive hierarchical indexing. Chunks → embed → cluster → LLM summarize each cluster → embed summaries → cluster again → summarize → repeat until root. Query-time retrieval traverses multiple tree levels.

**Results:** +20% absolute accuracy on QuALITY benchmark with GPT-4.

**Hachi pattern:** Indexing pipeline with recursive loop. Query pipeline with tree retriever node.

---

## 8. Agentic RAG

### 8.1 ReAct — Reasoning + Acting

**ArXiv:** [2210.03629](https://arxiv.org/abs/2210.03629)
**Authors:** Shunyu Yao et al.
**Date:** October 2022 (ICLR 2023)

**The foundational agentic pattern.** LLM alternates between Thought (reasoning), Action (tool use), and Observation (tool result).

```
Query → LLM: Thought 1 → Action: Search["query"] → Observation: results
  → LLM: Thought 2 → Action: Lookup["term"] → Observation: results
  → ... → LLM: Thought N → Action: Finish[answer] → Answer
```

**Results:** On ALFWorld/WebShop, 1-2 shot ReAct outperformed RL methods trained on 10³-10⁵ instances.

**Hachi node:** `agent` node with connected tool nodes. Loop with tool hub.

---

### 8.2 Toolformer — Self-Supervised Tool Use

**ArXiv:** [2302.04761](https://arxiv.org/abs/2302.04761)
**Authors:** Timo Schick et al. (Meta AI)
**Date:** February 2023 (NeurIPS 2023)

**Pattern:** Model fine-tuned to insert API calls inline during generation. Learns when and how to call tools from self-supervised signal (keeping only calls that reduce perplexity).

**Hachi node:** Agent node with embedded tool definitions.

---

### 8.3 Agentic RAG Survey

**ArXiv:** [2501.09136](https://arxiv.org/abs/2501.09136)
**Date:** January 2025

**Taxonomy of agentic patterns:**
1. **Reflection** — agent critiques its own retrieval and generation
2. **Planning** — agent decomposes complex queries and plans retrieval strategy
3. **Tool Use** — agent selects and invokes external tools/APIs
4. **Multi-agent Collaboration** — specialized agents work together

**Architectures:** Single-agent, multi-agent, hierarchical. Practical applications in healthcare, finance, education.

---

### 8.4 A-RAG — Scaling Agentic RAG (2026)

**ArXiv:** [2602.03442](https://arxiv.org/abs/2602.03442)
**Date:** February 2026

**Pattern:** Hierarchical multi-granularity retrieval tools exposed to the agent: `keyword_search`, `semantic_search`, `chunk_read`. Agent autonomously decides which tools to use, in what order, how many times.

**Key finding:** RAG quality scales directly with model capability. Stronger models make better retrieval decisions.

**Hachi node:** Agent node with three connected tool nodes. Represents the frontier of RAG design.

---

## 9. Graph RAG

### 9.1 Microsoft GraphRAG

**ArXiv:** [2404.16130](https://arxiv.org/abs/2404.16130)
**Authors:** Darren Edge et al. (Microsoft Research)
**Date:** April 2024

**Pattern:** Two-phase graph-based indexing:
1. LLM extracts entities and relationships → knowledge graph
2. Leiden community detection → hierarchical communities
3. LLM generates community summaries at multiple levels

**Query modes:**
- **Global Search:** Retrieve community summaries → LLM partial responses per community → map-reduce aggregation
- **Local Search:** Entity matching in KG → traverse local neighborhood → generate

**When to use:** Global sensemaking questions over 1M+ token datasets. "What are the main themes in X?" type questions.

**Hachi pattern:** [Indexing] Document → Entity Extractor → Graph Builder → Community Detection → Summarizer. [Query] Query → Community Retriever → Parallel LLM Responses → Aggregator → Answer.

---

### 9.2 LightRAG

**ArXiv:** [2410.05779](https://arxiv.org/abs/2410.05779)
**Date:** October 2024

**Pattern:** Dual-level graph+vector retrieval with incremental updates. Two modes:
- Low-level: entity/relationship lookup for specific facts
- High-level: multi-hop subgraph traversal for thematic queries

**Advantage over GraphRAG:** Simpler, faster, supports incremental updates without full reprocessing.

---

### 9.3 HippoRAG — Neurobiologically-Inspired

**ArXiv:** [2405.14831](https://arxiv.org/abs/2405.14831)
**Date:** May 2024 (NeurIPS 2024)

**Pattern:** Mimics human hippocampal memory. LLM extracts entities → schemaless KG. Query → extract key concepts → Personalized PageRank on KG → find relevant passages through graph proximity.

**Key result:** Single-step HippoRAG matches iterative IRCoT at 10-30x lower cost and 6-13x faster speed.

---

### 9.4 Graph RAG Survey

**ArXiv:** [2408.08921](https://arxiv.org/abs/2408.08921)
**Date:** August 2024

**Three stages:** G-Indexing (building graph indices), G-Retrieval (graph-aware retrieval), G-Generation (graph-structured context for LLMs). Covers knowledge graphs, scene graphs, citation graphs.

---

## 10. Multimodal & Specialized RAG

### 10.1 VisRAG — Vision-Based RAG

**ArXiv:** [2410.10594](https://arxiv.org/abs/2410.10594)
**Date:** October 2024

**Pattern:** Treat each document page as an image. VLM embeds page images for retrieval. Retrieved page images passed to generative VLM. Preserves all visual information (charts, figures, tables, layouts).

**Results:** 20-40% end-to-end gain over text-based RAG.

**Hachi (future):** Vision-RAG node type for document image retrieval.

---

### 10.2 TableRAG — Structured Data RAG

**ArXiv:** [2506.10380](https://arxiv.org/abs/2506.10380)

**Pattern:** Converts heterogeneous documents (text + tables) into unified database. Four iterative steps: query decomposition → text retrieval → SQL programming + execution → compositional answer generation.

**Hachi (future):** SQL Generator + Executor nodes alongside text retrieval.

---

### 10.3 RepoCoder — Code RAG

**ArXiv:** [2303.12570](https://arxiv.org/abs/2303.12570)
**Date:** March 2023

**Pattern:** Iterative retrieval-generation for repository-level code completion. Retrieve similar code → generate draft → use draft to refine retrieval → repeat.

**Results:** +10% over in-file completion baseline in all settings.

---

## 11. Surveys & Taxonomies

### 11.1 The Definitive RAG Survey — Naive / Advanced / Modular

**ArXiv:** [2312.10997](https://arxiv.org/abs/2312.10997)
**Authors:** Yunfan Gao et al. (Tongji / Fudan)
**Date:** December 2023 (revised March 2024)

**The most cited RAG survey. Defines three paradigms:**

**Naive RAG:** Simple retrieve-read pipeline.
- Index: chunk → embed → store in vector DB
- Retrieve: encode query → similarity search for top-k
- Generate: concatenate query + docs → LLM
- Limitations: low precision, hallucination, redundancy

**Advanced RAG:** Pre-retrieval and post-retrieval optimization.
- Pre: query rewriting, routing, expansion
- Retrieval: fine-tuned embeddings, hybrid search
- Post: reranking, compression, selection

**Modular RAG:** Flexible, composable modules.
- Search, Memory, Routing, Predict, Task Adapter modules
- Non-sequential flows: iterative, recursive, adaptive
- Can integrate fine-tuning within the RAG loop

**For Hachi:** The three paradigms map directly to template complexity levels. Modular RAG validates building a visual LEGO-like system where nodes compose freely.

---

### 11.2 Modular RAG — The LEGO Paper

**ArXiv:** [2407.21059](https://arxiv.org/abs/2407.21059)
**Authors:** Yunfan Gao et al.
**Date:** July 2024

**Three-tiered architecture:**
- **Tier 1 — Modules:** Indexing, Pre-Retrieval, Retrieval, Post-Retrieval, Generation, Orchestration
- **Tier 2 — Sub-Modules:** Functional components within each module
- **Tier 3 — Operators:** Specific implementations (BM25, DPR, ColBERT, cross-encoder, etc.)

**Four flow patterns:**
1. **Linear** — Sequential: Retrieve → Process → Generate
2. **Conditional** — Route queries to different pipelines based on type
3. **Branching** — Parallel retrieval from multiple sources, merge
4. **Looping** — Iterative retrieval-generation with feedback

**Orchestration mechanisms:** Routing, Rule Judge, LLM Judge.

**For Hachi:** This paper IS the theoretical blueprint for a visual RAG builder. The three-tier hierarchy maps to node types. The four flow patterns are exactly what users construct on the canvas. Orchestration nodes (router, judge) are essential.

---

### 11.3 Searching for Best Practices (Systematic Ablation)

**ArXiv:** [2407.01219](https://arxiv.org/abs/2407.01219)
**Date:** July 2024 (ACL 2025 Findings)

**Decomposes RAG into 9 modules and systematically ablates each:**
1. Query Classification (whether retrieval is needed)
2. Chunking strategies
3. Embedding model selection
4. Vector database choice
5. Retrieval algorithm
6. Reranking
7. Repacking (organizing context for the generator)
8. Summarization
9. Fine-tuning

**Key findings:**
- **Query classification has outsized impact** — deciding IF retrieval is needed matters more than most other components
- **Reranking consistently improves results** across configurations
- **Repacking order matters** — how you arrange chunks affects generation quality
- Best practices balance performance AND efficiency (latency matters)

**For Hachi:** This is the "which nodes matter" paper. Query Classification and Reranking should be first-class nodes. Repacking is underappreciated and should be included.

---

### 11.4 RAGSmith — Automated Pipeline Optimization

**ArXiv:** [2511.01386](https://arxiv.org/abs/2511.01386)
**Date:** November 2025

**9-stage modular pipeline with 46,080 possible configurations.** Uses genetic algorithms to evolve complete pipeline configurations. Evaluates holistically — modules suboptimal in isolation can shine in combination.

**Key findings:**
- Optimal RAG configurations are **domain-dependent** (law differs from medicine)
- Holistic optimization outperforms greedy per-module optimization by +3.8% average
- Gains range from +1.2% to +6.9% across domains

**For Hachi:** Validates that the pipeline builder should eventually support automated pipeline optimization — try different configurations and report which performs best.

---

### 11.5 Other Major Surveys

| Survey | ArXiv | Date | Focus |
|--------|-------|------|-------|
| RAG for AIGC | [2402.19473](https://arxiv.org/abs/2402.19473) | Feb 2024 | Four augmentation paradigms (query, latent, logit, speculative). Multimodal RAG. |
| Comprehensive Evolution | [2410.12837](https://arxiv.org/abs/2410.12837) | Oct 2024 | Historical evolution from early IR to modern RAG. |
| Architectures & Robustness | [2506.00054](https://arxiv.org/abs/2506.00054) | May 2025 | Four architecture classes: retriever-centric, generator-centric, hybrid, robustness-oriented. |
| RAG Meets LLMs (KDD) | [2405.06211](https://arxiv.org/abs/2405.06211) | May 2024 | Architectures, training strategies, applications. |
| Retrieval-Augmented Text Gen | [2404.10981](https://arxiv.org/abs/2404.10981) | Apr 2024 | Four-stage pipeline taxonomy: pre-retrieval, retrieval, post-retrieval, generation. |
| Agentic RAG | [2501.09136](https://arxiv.org/abs/2501.09136) | Jan 2025 | Single-agent, multi-agent, hierarchical agentic RAG. |

---

## 12. Evaluation & Benchmarks

### 12.1 RAGAS — The Standard

**ArXiv:** [2309.15217](https://arxiv.org/abs/2309.15217)
**Date:** September 2023 (EACL 2024)

**Reference-free evaluation framework. Four core metrics (LLM-as-judge):**
- **Faithfulness** — is the answer grounded in retrieved context?
- **Answer Relevancy** — does the answer address the question?
- **Context Precision** — are retrieved passages actually relevant?
- **Context Recall** — did retrieval find all needed information?

**For Hachi:** The de facto standard. These four metrics should power the `judge`/`evaluator` node and evaluation dashboards.

---

### 12.2 ARES — Statistical Evaluation

**ArXiv:** [2311.09476](https://arxiv.org/abs/2311.09476)
**Date:** November 2023 (NAACL 2024)

**Generates synthetic training data, fine-tunes lightweight LM judges, uses prediction-powered inference (PPI) for confidence intervals.** Needs only a few hundred human annotations.

**For Hachi:** More robust than RAGAS for production evaluation. Could power an advanced evaluation mode.

---

### 12.3 RGB — Retrieval-Augmented Generation Benchmark

**ArXiv:** [2309.01431](https://arxiv.org/abs/2309.01431)
**Date:** September 2023

**Four diagnostic abilities:**
1. **Noise Robustness** — handle irrelevant retrieved documents
2. **Negative Rejection** — refuse to answer when retrieval fails
3. **Information Integration** — synthesize across passages
4. **Counterfactual Robustness** — resist false information in retrieved passages

**Finding:** LLMs show some noise robustness but struggle with negative rejection, information integration, and counterfactual robustness.

---

### 12.4 RAGBench

**ArXiv:** [2407.11005](https://arxiv.org/abs/2407.11005)
**Date:** June 2024

**100K examples with TRACe framework:** contexT utilization, context Relevance, Adherence/faithfulness, answer Completeness. 5 industry domains. Key finding: fine-tuned 400M DeBERTa outperforms few-shot LLM judges on RAG evaluation.

---

## 13. Paradigm Shifts (2024-2026)

### 13.1 Long Context vs. RAG Debate

**In Defense of RAG ArXiv:** [2409.01666](https://arxiv.org/abs/2409.01666) (September 2024)
- Long contexts → diminished focus on relevant info. OP-RAG (Order-Preserve RAG) shows an inverted U-curve: RAG quality rises then falls with chunk count. There's a "sweet spot" that outperforms full context.

**Long Context vs. RAG ArXiv:** [2501.01880](https://arxiv.org/abs/2501.01880) (December 2024)
- Long context generally outperforms RAG for Wikipedia QA
- RAG excels for dialogue-based and fragmented information
- Summarization-based retrieval performs comparably to long context; chunk-based lags

**RAG vs. Fine-Tuning ArXiv:** [2401.08406](https://arxiv.org/abs/2401.08406) (January 2024)
- Fine-tuning improved accuracy ~6 points; RAG added ~5 more on top
- Combining both yields best results
- RAG excels at precise, location-specific knowledge

**Fine-Tuning or Retrieval ArXiv:** [2312.05934](https://arxiv.org/abs/2312.05934) (December 2023)
- RAG consistently outperformed fine-tuning across models and tasks
- For unseen/current events: RAG scored 0.875 vs fine-tuning's 0.504

**Verdict:** Neither approach dominates universally. RAG wins for current knowledge, fragmented info, and precision. Long context wins for self-contained documents.

---

### 13.2 Cache-Augmented Generation (CAG)

**ArXiv:** [2412.15605](https://arxiv.org/abs/2412.15605)
**Date:** December 2024

**Pattern:** Preload entire knowledge base into LLM's extended context. Cache the KV-cache state. At inference, queries answered from cached state — no retrieval step at all.

```
[Offline] Full corpus → Load into LLM context → Cache KV-cache to disk
[Inference] Query → Load cached KV-cache → LLM Generate → Answer
```

**When to use:** Bounded knowledge bases that fit in context. Eliminates retrieval latency and errors entirely.

**For Hachi:** Could be a minimal 2-node pipeline template. Represents when RAG is overkill.

---

### 13.3 Speculative RAG

**ArXiv:** [2407.08223](https://arxiv.org/abs/2407.08223)
**Date:** July 2024 (ICLR 2025)

**Pattern:** Retrieved docs partitioned into subsets. Smaller specialist LM generates draft answers in parallel (one per subset). Larger generalist LM verifies and selects/synthesizes best answer.

```
Docs → Partition into K subsets
  → [Specialist LM: Draft 1] (parallel)
  → [Specialist LM: Draft 2] (parallel)
  → [Specialist LM: Draft 3] (parallel)
  → [Generalist LM: Verify & select] → Answer
```

**Results:** +12.97% accuracy, -50.83% latency vs. conventional RAG.

**For Hachi:** Fan-out / fan-in visual pattern. Demonstrates the power of visual pipeline building for complex execution patterns.

---

## 14. RAG Failure Modes & Debugging

### 14.1 RAGged Edges — Double-Edged Sword

**ArXiv:** [2403.01193](https://arxiv.org/abs/2403.01193)
**Date:** March 2024

**Findings:** RAG increases accuracy but can still be misled. RAG errors (misrepresenting retrieved data) may be as harmful as hallucinations. Knowledge conflicts between parametric and non-parametric memory are a fundamental challenge.

---

### 14.2 RAG Without the Lag — RAGGY

**ArXiv:** [2504.13587](https://arxiv.org/abs/2504.13587)
**Date:** April 2025

**User study with 12 engineers found:**
- Failure in retrieval OR generation cascades — both must be inspectable
- Developers need instant feedback when changing chunk size, embedding model, or prompts
- Biggest bottleneck: parameter changes (chunk size) require hours of re-indexing
- Developers naturally want to visualize how changes impact each pipeline stage independently

**Tool (RAGGY):** Composable RAG primitives + interactive UI for real-time pipeline debugging.

**For Hachi:** Directly validates the visual pipeline builder concept. Every finding maps to Hachi's design goals — per-node inspection, real-time parameter adjustment, side-by-side comparison.

---

### 14.3 Hallucination Taxonomy in RAG

From survey literature, RAG failures arise from two stages:

**Retrieval Failure:**
- Data source problems (incomplete, outdated corpus)
- Poor queries (ambiguous, under-specified)
- Weak retrievers (wrong embedding model, poor chunking)
- Wrong retrieval strategy (dense when sparse needed, or vice versa)

**Generation Deficiency:**
- Context noise (irrelevant passages pollute generation)
- Context conflict (retrieved passages contradict each other)
- Lost in the middle (relevant info buried in wrong position)
- Alignment issues (model ignores context in favor of parametric knowledge)
- Capability boundary (model can't synthesize the information)

**For Hachi:** Each failure mode maps to a specific pipeline stage that Wire Tap can expose. The visual builder makes debugging systematic rather than guesswork.

---

## 15. Implications for Hachi

### 15.1 Essential Node Types (Validated by Research)

| Node Type | Research Validation | Priority |
|-----------|-------------------|----------|
| **Query Input** | Every RAG paper starts here | Core |
| **Query Rewriter** | HyDE, Query2Doc, Step-Back, DMQR-RAG | Core |
| **Query Classifier / Router** | Adaptive-RAG, Self-RAG, "Searching for Best Practices" (outsized impact) | Core |
| **Embedding** | DPR, ColBERT, BGE M3, Late Chunking | Core |
| **Retriever** (dense) | DPR, RETRO, Atlas | Core |
| **Retriever** (sparse/BM25) | Hybrid search papers | Core |
| **Hybrid Retriever** | Fusion analysis, DAT | Core |
| **Reranker** | BGE, RankGPT, FIRST. "Searching for Best Practices" (consistently helps) | Core |
| **LLM / Generator** | Every RAG paper | Core |
| **Judge / Evaluator** | Self-RAG, CRAG, RAGAS | Core |
| **HyDE** | Gao et al. 2022 | Core (already in Hachi) |
| **Agent** | ReAct, Toolformer, A-RAG | Core (already in Hachi) |
| **Context Compressor** | LLMLingua, RECOMP, Selective Context, FILCO | High |
| **Context Optimizer** | Lost in the Middle (position reordering) | High |
| **Web Search Fallback** | CRAG (corrective fallback) | High |
| **RRF / Fusion** | RAG-Fusion, hybrid search | High |
| **Document Chunker** | HiChunk, Contextual Retrieval, Late Chunking | High |
| **Graph Retriever** | GraphRAG, LightRAG, HippoRAG | Medium |
| **Entity Extractor** | GraphRAG (KG construction) | Medium |
| **Multi-Query Generator** | RAG-Fusion, DMQR-RAG | Medium |
| **VLM Retriever** | VisRAG (future) | Low |
| **SQL Generator** | TableRAG (future) | Low |

### 15.2 Essential Pipeline Templates

| Template | Pattern | Research Source |
|----------|---------|----------------|
| **Naive RAG** | Query → Embed → Retrieve → Generate | Lewis et al. 2020 |
| **Advanced RAG** | Query → Rewrite → Embed → Retrieve → Rerank → Generate | Gao et al. survey |
| **HyDE RAG** | Query → HyDE → Embed → Retrieve → Generate | Gao et al. 2022 |
| **CRAG** | Query → Retrieve → Judge → [Generate / Web Search] | Yan et al. 2024 |
| **Adaptive RAG** | Query → Router → [No Retrieval / Single-Step / Multi-Step] | Jeong et al. 2024 |
| **RAG-Fusion** | Query → Multi-Query → [Parallel Retrievers] → RRF → Generate | Rackauckas 2024 |
| **Self-Reflective RAG** | Query → [Judge: Retrieve?] → Retrieve → [Judge: Relevant?] → Generate → [Judge: Supported?] | Asai et al. 2023 |
| **Iterative RAG** | Query → Retrieve → Generate → Reformulate → Retrieve → ... → Final | Iter-RetGen, IRCoT |
| **Speculative RAG** | Query → Retrieve → Partition → [Parallel Drafts] → Verify → Answer | Wang et al. 2024 |
| **Graph RAG** | Query → Community Retriever → [Parallel Responses] → Aggregate | Edge et al. 2024 |

### 15.3 Key Design Insight

From the Modular RAG paper and RAGSmith:

> **Optimal RAG configurations are task-specific and domain-specific.** A visual builder should not prescribe a single "best" pipeline but instead make it easy to experiment with different configurations and measure their impact.

Hachi is not just a construction tool — it is an **experimentation platform**. The research overwhelmingly confirms that:
1. No single pipeline works best for all tasks
2. Component interactions matter (modules suboptimal in isolation can shine in combination)
3. The ability to rapidly swap components, compare variants, and measure impact is the core value

This aligns perfectly with Hachi's vision of a visual engineering environment with deep tracing, evaluation, and comparison.

---

## 16. Paper Index

### Foundational
| Paper | ArXiv | Year |
|-------|-------|------|
| RAG (Lewis et al.) | [2005.11401](https://arxiv.org/abs/2005.11401) | 2020 |
| REALM (Guu et al.) | [2002.08909](https://arxiv.org/abs/2002.08909) | 2020 |
| DPR (Karpukhin et al.) | [2004.04906](https://arxiv.org/abs/2004.04906) | 2020 |
| kNN-LM (Khandelwal et al.) | [1911.00172](https://arxiv.org/abs/1911.00172) | 2019 |
| FiD (Izacard & Grave) | [2007.01282](https://arxiv.org/abs/2007.01282) | 2020 |
| RETRO (Borgeaud et al.) | [2112.04426](https://arxiv.org/abs/2112.04426) | 2022 |
| Atlas (Izacard et al.) | [2208.03299](https://arxiv.org/abs/2208.03299) | 2022 |
| REPLUG (Shi et al.) | [2301.12652](https://arxiv.org/abs/2301.12652) | 2023 |

### Query Enhancement
| Paper | ArXiv | Year |
|-------|-------|------|
| HyDE (Gao et al.) | [2212.10496](https://arxiv.org/abs/2212.10496) | 2022 |
| Query2Doc (Wang et al.) | [2303.07678](https://arxiv.org/abs/2303.07678) | 2023 |
| Step-Back Prompting (Zheng et al.) | [2310.06117](https://arxiv.org/abs/2310.06117) | 2023 |
| RAG-Fusion (Rackauckas) | [2402.03367](https://arxiv.org/abs/2402.03367) | 2024 |
| DMQR-RAG (Li et al.) | [2411.13154](https://arxiv.org/abs/2411.13154) | 2024 |
| RQ-RAG (Chan et al.) | [2404.00610](https://arxiv.org/abs/2404.00610) | 2024 |
| PruneRAG (Jiao et al.) | [2601.11024](https://arxiv.org/abs/2601.11024) | 2026 |

### Retrieval
| Paper | ArXiv | Year |
|-------|-------|------|
| ColBERT (Khattab & Zaharia) | [2004.12832](https://arxiv.org/abs/2004.12832) | 2020 |
| ColBERTv2 (Santhanam et al.) | [2112.01488](https://arxiv.org/abs/2112.01488) | 2021 |
| Fusion Analysis (Bruch et al.) | [2210.11934](https://arxiv.org/abs/2210.11934) | 2022 |
| BGE M3-Embedding (Chen et al.) | [2402.03216](https://arxiv.org/abs/2402.03216) | 2024 |
| Contextual Retrieval (Anthropic) | Blog post | 2024 |
| Late Chunking (Gunther et al.) | [2409.04701](https://arxiv.org/abs/2409.04701) | 2024 |
| DAT (Hsu & Tzeng) | [2503.23013](https://arxiv.org/abs/2503.23013) | 2025 |
| HiChunk (Tencent) | [2509.11552](https://arxiv.org/abs/2509.11552) | 2025 |

### Reranking
| Paper | ArXiv | Year |
|-------|-------|------|
| BGE Reranker (Xiao et al.) | [2309.07597](https://arxiv.org/abs/2309.07597) | 2023 |
| RankGPT (Sun et al.) | [2304.09542](https://arxiv.org/abs/2304.09542) | 2023 |
| FIRST (Reddy et al.) | [2406.15657](https://arxiv.org/abs/2406.15657) | 2024 |
| Reranking Evolution Survey | [2512.16236](https://arxiv.org/abs/2512.16236) | 2025 |
| MICE (Minimal Cross-Encoder) | [2602.16299](https://arxiv.org/abs/2602.16299) | 2026 |

### Context Optimization
| Paper | ArXiv | Year |
|-------|-------|------|
| Lost in the Middle (Liu et al.) | [2307.03172](https://arxiv.org/abs/2307.03172) | 2023 |
| LLMLingua (Jiang et al.) | [2310.05736](https://arxiv.org/abs/2310.05736) | 2023 |
| LongLLMLingua (Jiang et al.) | [2310.06839](https://arxiv.org/abs/2310.06839) | 2023 |
| RECOMP (Xu et al.) | [2310.04408](https://arxiv.org/abs/2310.04408) | 2023 |
| Selective Context (Li et al.) | [2310.06201](https://arxiv.org/abs/2310.06201) | 2023 |
| FILCO (Wang et al.) | [2311.08377](https://arxiv.org/abs/2311.08377) | 2023 |

### Iterative & Multi-Hop
| Paper | ArXiv | Year |
|-------|-------|------|
| IRCoT (Trivedi et al.) | [2212.10509](https://arxiv.org/abs/2212.10509) | 2022 |
| FLARE (Jiang et al.) | [2305.06983](https://arxiv.org/abs/2305.06983) | 2023 |
| Iter-RetGen (Shao et al.) | [2305.15294](https://arxiv.org/abs/2305.15294) | 2023 |
| Self-RAG (Asai et al.) | [2310.11511](https://arxiv.org/abs/2310.11511) | 2023 |
| CRAG (Yan et al.) | [2401.15884](https://arxiv.org/abs/2401.15884) | 2024 |
| Adaptive-RAG (Jeong et al.) | [2403.14403](https://arxiv.org/abs/2403.14403) | 2024 |
| RAPTOR (Sarthi et al.) | [2401.18059](https://arxiv.org/abs/2401.18059) | 2024 |

### Agentic
| Paper | ArXiv | Year |
|-------|-------|------|
| ReAct (Yao et al.) | [2210.03629](https://arxiv.org/abs/2210.03629) | 2022 |
| Toolformer (Schick et al.) | [2302.04761](https://arxiv.org/abs/2302.04761) | 2023 |
| Agentic RAG Survey | [2501.09136](https://arxiv.org/abs/2501.09136) | 2025 |
| A-RAG (Du et al.) | [2602.03442](https://arxiv.org/abs/2602.03442) | 2026 |

### Graph RAG
| Paper | ArXiv | Year |
|-------|-------|------|
| GraphRAG (Edge et al.) | [2404.16130](https://arxiv.org/abs/2404.16130) | 2024 |
| LightRAG (Guo et al.) | [2410.05779](https://arxiv.org/abs/2410.05779) | 2024 |
| HippoRAG (Gutierrez et al.) | [2405.14831](https://arxiv.org/abs/2405.14831) | 2024 |
| Graph RAG Survey (Peng et al.) | [2408.08921](https://arxiv.org/abs/2408.08921) | 2024 |

### Multimodal & Code
| Paper | ArXiv | Year |
|-------|-------|------|
| VisRAG (Yu et al.) | [2410.10594](https://arxiv.org/abs/2410.10594) | 2024 |
| TableRAG | [2506.10380](https://arxiv.org/abs/2506.10380) | 2025 |
| RepoCoder (Zhang et al.) | [2303.12570](https://arxiv.org/abs/2303.12570) | 2023 |
| CodeRAG-Bench (Wang et al.) | [2406.14497](https://arxiv.org/abs/2406.14497) | 2024 |

### Surveys & Taxonomies
| Paper | ArXiv | Year |
|-------|-------|------|
| RAG for LLMs Survey (Gao et al.) | [2312.10997](https://arxiv.org/abs/2312.10997) | 2023 |
| Modular RAG (Gao et al.) | [2407.21059](https://arxiv.org/abs/2407.21059) | 2024 |
| Searching for Best Practices | [2407.01219](https://arxiv.org/abs/2407.01219) | 2024 |
| RAG for AIGC (Zhao et al.) | [2402.19473](https://arxiv.org/abs/2402.19473) | 2024 |
| Comprehensive Evolution | [2410.12837](https://arxiv.org/abs/2410.12837) | 2024 |
| Architectures & Robustness | [2506.00054](https://arxiv.org/abs/2506.00054) | 2025 |
| RAG Meets LLMs (KDD) | [2405.06211](https://arxiv.org/abs/2405.06211) | 2024 |
| Retrieval-Augmented Text Gen | [2404.10981](https://arxiv.org/abs/2404.10981) | 2024 |
| RAGSmith | [2511.01386](https://arxiv.org/abs/2511.01386) | 2025 |

### Evaluation & Benchmarks
| Paper | ArXiv | Year |
|-------|-------|------|
| RAGAS (Es et al.) | [2309.15217](https://arxiv.org/abs/2309.15217) | 2023 |
| ARES (Saad-Falcon et al.) | [2311.09476](https://arxiv.org/abs/2311.09476) | 2023 |
| RGB Benchmark (Chen et al.) | [2309.01431](https://arxiv.org/abs/2309.01431) | 2023 |
| RAGBench (Friel et al.) | [2407.11005](https://arxiv.org/abs/2407.11005) | 2024 |
| RAG Evaluation Survey | [2405.07437](https://arxiv.org/abs/2405.07437) | 2024 |
| RAG Eval in LLM Era | [2504.14891](https://arxiv.org/abs/2504.14891) | 2025 |

### Paradigm Shifts
| Paper | ArXiv | Year |
|-------|-------|------|
| In Defense of RAG | [2409.01666](https://arxiv.org/abs/2409.01666) | 2024 |
| Long Context vs. RAG | [2501.01880](https://arxiv.org/abs/2501.01880) | 2024 |
| RAG vs Fine-tuning | [2401.08406](https://arxiv.org/abs/2401.08406) | 2024 |
| Fine-Tuning or Retrieval | [2312.05934](https://arxiv.org/abs/2312.05934) | 2023 |
| Cache-Augmented Generation | [2412.15605](https://arxiv.org/abs/2412.15605) | 2024 |
| Speculative RAG | [2407.08223](https://arxiv.org/abs/2407.08223) | 2024 |
| LC vs RAG Hybrid (Self-Route) | [2407.16833](https://arxiv.org/abs/2407.16833) | 2024 |

### Failure Modes & Debugging
| Paper | ArXiv | Year |
|-------|-------|------|
| RAGged Edges (Feldman et al.) | [2403.01193](https://arxiv.org/abs/2403.01193) | 2024 |
| RAG Without the Lag / RAGGY | [2504.13587](https://arxiv.org/abs/2504.13587) | 2025 |
| Chronicles of RAG (Finardi et al.) | [2401.07883](https://arxiv.org/abs/2401.07883) | 2024 |
