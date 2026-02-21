# Real-Time Collaboration

---

## 1. Architecture

Yjs (CRDT library) + WebSocket for conflict-free real-time sync.

```
┌────────────────────┐         ┌────────────────────┐
│     User A          │         │     User B          │
│  ┌──────────────┐   │   WS   │   ┌──────────────┐  │
│  │ Yjs Doc (A)  │◄──┼────────┼──►│ Yjs Doc (B)  │  │
│  └──────┬───────┘   │         │   └──────┬───────┘  │
│         │           │         │          │          │
│  ┌──────▼───────┐   │         │   ┌──────▼───────┐  │
│  │ Canvas Store │   │         │   │ Canvas Store │  │
│  └──────────────┘   │         │   └──────────────┘  │
└────────────────────┘         └────────────────────┘
              │                          │
              └──────────┬───────────────┘
                         │
              ┌──────────▼──────────┐
              │   Yjs WS Server      │
              │   (Bun WebSocket)    │
              │                      │
              │   Room: canvas-{id}  │
              │   Persists to DB     │
              └─────────────────────┘
```

## 2. What Gets Synced

| Data | Sync Method | Conflict Resolution |
|------|------------|-------------------|
| Node positions | Yjs Map | Last writer wins |
| Node configs | Yjs Map | Field-level merge |
| Edges | Yjs Array | Both changes apply |
| Node additions/deletions | Yjs Map | CRDT automatic |
| Cursor positions | Awareness protocol | Ephemeral (not persisted) |
| User presence | Awareness protocol | Ephemeral |
| Selection highlights | Awareness protocol | Ephemeral |

## 3. Presence Features

- **Live cursors** — Each user has a colored cursor on the canvas
- **Selection highlights** — See what nodes others have selected
- **Activity status** — "Alice is editing HyDE node"
- **Online indicator** — Avatar stack showing who's in the canvas
- **Follow mode** — Click avatar to follow their viewport

## 4. Conflict Handling

Yjs CRDTs handle all conflicts automatically:

| Scenario | Resolution |
|----------|-----------|
| Two users move same node simultaneously | Last position wins (instant) |
| Two users edit same node config | Field-level merge (both apply) |
| User A deletes node that User B is editing | Node deleted, B gets notification |
| Both users create edges at same time | Both edges created |
| Offline user reconnects | Changes merged automatically |

## 5. Persistence

Canvas Yjs state is persisted to the `canvases.yjs_state` column:
- On each change, Yjs state is base64-encoded and saved
- On canvas load, if Yjs state exists, it's restored
- If no Yjs state, `graph_json` is used as the initial state
- This enables offline-capable editing
