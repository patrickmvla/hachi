# Vision & Product

---

## 1. Vision & Identity

Hachi is an engineering tool. Not a chatbot builder. Not a low-code platform. Not a demo.

It exists because production RAG systems are architecturally complex and the gap between "I read about HyDE" and "I implemented a working HyDE pipeline" is enormous. Teams waste weeks wiring up retrieval patterns they don't fully understand, debugging failures they can't see, and having architecture discussions on whiteboards that never execute.

Hachi gives engineering teams a **React Flow canvas** where they design RAG architectures visually, **execute them against real data**, and **inspect every step** through Wire Tap. When your retrieval scores are garbage, you don't stare at logs — you click the connection between your Embed node and your Retrieve node and see exactly what vector was produced, what similarity scores came back, and why your results are wrong.

The name comes from Hachikō (ハチ公) — the dog famous for loyalty and reliability. That's the standard: a platform you can depend on to show you the truth about your RAG pipeline.

**Hachi is not:**
- A production deployment platform (you take the architecture and implement it)
- A no-code tool (our users write code for a living)
- A playground (real LLM calls, real embeddings, real data)
- A wrapper around LangChain/LlamaIndex (it compiles to Mastra workflows)

**Hachi is:**
- An architecture design tool for RAG systems
- A debugging environment with full data inspection
- A collaboration platform for engineering teams
- A reference library of proven retrieval patterns

---

## 2. The Problem — In Detail

### 2.1 The Naive RAG Trap

Every team starts the same way:

```
Query → Embed → Vector Search → Top K Results → Stuff into LLM → Response
```

This works for demos. It fails in production because:

1. **Short queries produce weak embeddings.** "pricing" becomes a sparse vector that matches everything poorly. The team doesn't know this because they never see the embedding.

2. **Vector search alone misses keyword matches.** A user searching for "error code E-4201" gets semantic matches about error handling instead of the specific document mentioning E-4201. Vector search is semantic — it doesn't do exact matching.

3. **Irrelevant context causes hallucination.** The retriever returns 5 documents, 3 are irrelevant, the LLM hallucinates based on the irrelevant ones. The team blames the LLM when the problem is the retriever.

4. **No visibility into failures.** When the pipeline produces wrong answers, the team has no idea which step failed. Was it the embedding? The retrieval? The prompt? They add logging, but logs are flat text — they don't show the data flow.

### 2.2 The Architecture Gap

Teams know these patterns exist:

| Pattern | What It Does | Why Teams Don't Use It |
|---------|-------------|----------------------|
| **HyDE** | Generates a hypothetical answer, embeds that instead of the query | Hard to visualize the improvement |
| **Hybrid Search** | Combines BM25 keyword search with vector search using RRF | Complex to wire up correctly |
| **Reranking** | Cross-encoder rescores retrieval results | Unclear when it helps vs hurts |
| **CRAG** | Judge evaluates retrieval quality, falls back to web search | Conditional routing is hard to debug |
| **Parent-Child** | Embed small chunks, return parent chunks for context | Chunking strategy is non-obvious |
| **Multi-Hop** | Iteratively retrieves and refines | Stopping condition is tricky |
| **Agentic RAG** | Agent decides when/how to retrieve | Agent behavior is opaque |

The knowledge exists in papers and blog posts. But going from "I understand the concept" to "I have a working implementation" requires:
- Wiring components together correctly
- Understanding data transformations between steps
- Debugging when intermediate results are wrong
- Comparing approaches to find the best one for your data

This is what Hachi solves.

### 2.3 Why Whiteboards Fail

Architecture discussions happen on whiteboards. The whiteboard shows boxes and arrows. But it doesn't show:
- What data flows through each arrow
- What happens when the Judge says "irrelevant"
- How the embedding of "pricing" differs from the embedding of "What are your pricing tiers for enterprise customers?"
- Whether reranking actually improves your results or just adds latency

Hachi replaces the whiteboard with a canvas that executes. Same boxes, same arrows — but you can run it and inspect every step.

---

## 3. Target Users

### 3.1 Primary: The RAG Engineering Team

**Profile:**
- 2-8 engineers building retrieval-augmented systems
- Already past "hello world" RAG — they've shipped a basic pipeline
- Hitting quality issues they can't diagnose
- Need to evaluate advanced patterns before committing to production code

**What they know:** Embeddings, vector databases, LLM APIs, basic RAG pipeline structure.

**What they struggle with:** Choosing between retrieval strategies, debugging quality issues, understanding why a pattern helps or hurts their specific data.

### 3.2 Secondary: The ML Platform Engineer

**Profile:**
- Building internal RAG infrastructure for multiple teams
- Needs to standardize retrieval patterns across the organization
- Creates reference architectures that other teams can adopt

### 3.3 Not Our Users

- Beginners learning what RAG is (we assume foundational knowledge)
- No-code builders (we're an engineering tool)
- Teams looking for a hosted RAG solution (we help you design, not deploy)
- Solo developers building simple chatbots (overkill for basic use cases)

---

## 4. Core Use Cases

### 4.1 Architecture Design

A team needs a RAG system for legal document search. Ambiguous queries are the primary challenge — lawyers search for concepts, not keywords.

**Workflow in Hachi:**
1. Load the Naive RAG template as a baseline
2. Run sample queries, inspect Wire Tap — see that short queries produce weak embeddings
3. Insert a HyDE node between Query and Embed — run again, Wire Tap shows the hypothetical document is much richer
4. Add a Judge node after Retrieve — Wire Tap shows it catches irrelevant results
5. Compare retrieval scores before and after each change
6. Export the architecture as the team's implementation blueprint

### 4.2 Debugging Failures

A deployed RAG system returns wrong answers for medical terminology queries. The team doesn't know why.

**Workflow in Hachi:**
1. Recreate the current pipeline on canvas
2. Run a failing query: "contraindications for metformin with renal impairment"
3. Wire Tap the Embed node → embedding captures "renal" but loses "contraindications" nuance
4. Wire Tap the Retrieve node → top results are about metformin dosing, not contraindications
5. Diagnosis: the embedding model doesn't understand medical term relationships
6. Solution: add domain-specific reranking or switch embedding model
7. Test fix, verify via Wire Tap that retrieval quality improves

### 4.3 Team Knowledge Sharing

A senior engineer understands CRAG. The implementing team doesn't.

**Workflow in Hachi:**
1. Senior builds CRAG pipeline on shared canvas (live cursors show the team what's happening)
2. Run a query that triggers the "relevant" path — Wire Tap shows Judge reasoning
3. Run a query that triggers the "irrelevant" path — Wire Tap shows fallback to web search
4. Team sees both paths, understands the routing logic, asks questions in real-time
5. Everyone now has the mental model to implement it

### 4.4 Pattern Comparison

A team needs to decide between HyDE and Hybrid Search for their use case.

**Workflow in Hachi:**
1. Build both pipelines side by side (or sequentially)
2. Run the same 10 queries through both
3. Compare retrieval scores, latency, and output quality via Wire Tap
4. Data-driven decision: HyDE is better for short queries, Hybrid Search is better for keyword-heavy queries
5. Maybe combine both — wire them together on canvas and test
