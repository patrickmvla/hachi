# Reference Architectures

---

Pre-built pipeline templates that users can load, run, inspect, and modify.

## 1. Naive RAG

```
[Query] → [Embed] → [Retrieve] → [Generate]
```
- **Purpose:** Baseline for comparison
- **When to use:** Simple document Q&A, well-formed queries
- **Limitation:** Fails on short/ambiguous queries, no quality check

## 2. HyDE Pipeline

```
[Query] → [HyDE] → [Embed] → [Retrieve] → [Generate]
```
- **Purpose:** Solve the semantic gap for short queries
- **When to use:** User queries are short, ambiguous, or lack domain vocabulary
- **Key insight:** Embedding a hypothetical answer produces a richer vector than embedding the query directly

## 3. CRAG (Corrective RAG)

```
[Query] → [Embed] → [Retrieve] → [Judge] → [Generate]
                                      ↓ (if irrelevant)
                               [Web Search] → [Generate]
```
- **Purpose:** Self-correcting retrieval with fallback
- **When to use:** Need robust retrieval even when local knowledge base doesn't have the answer
- **Key insight:** A Judge LLM evaluates context relevance before generation, preventing hallucination from bad context

## 4. Hybrid Search

```
                    ┌→ [BM25 Search] ──┐
[Query] → [Split] ─┤                   ├→ [Fusion (RRF)] → [Rerank] → [Generate]
                    └→ [Vector Search] ─┘
```
- **Purpose:** Combine keyword and semantic search
- **When to use:** Documents contain important keywords/codes that semantic search misses
- **Key insight:** BM25 catches exact matches, vector search catches semantic matches, RRF merges them, cross-encoder reranks

## 5. Multi-Hop RAG

```
[Query] → [Embed] → [Retrieve] → [Generate Sub-Query] → [Embed] → [Retrieve] → [Generate Final]
```
- **Purpose:** Answer complex questions requiring information from multiple documents
- **When to use:** "Compare X and Y" or "What caused Z given A and B?"
- **Key insight:** Iterative retrieval refines the question based on partial answers

## 6. Agentic RAG

```
[Query] → [Agent] ←→ [Retrieve Tool]
              ↓         [Web Search Tool]
          [Generate]    [Calculator Tool]
```
- **Purpose:** Autonomous retrieval — agent decides when and what to retrieve
- **When to use:** Open-ended questions where the retrieval strategy isn't known upfront
- **Key insight:** ReAct loop (Reason → Act → Observe) lets the agent plan its own retrieval strategy
