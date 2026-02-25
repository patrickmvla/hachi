export const queryKeys = {
  canvases: {
    all: ["canvases"] as const,
    list: (orgId: string) => ["canvases", "list", orgId] as const,
    detail: (id: string) => ["canvases", "detail", id] as const,
  },
  drawings: {
    all: ["drawings"] as const,
    list: (orgId: string) => ["drawings", "list", orgId] as const,
    detail: (id: string) => ["drawings", "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (orgId: string) => ["documents", "list", orgId] as const,
    detail: (id: string) => ["documents", "detail", id] as const,
  },
  runs: {
    all: ["runs"] as const,
    list: (canvasId: string) => ["runs", "list", canvasId] as const,
    detail: (id: string) => ["runs", "detail", id] as const,
  },
  templates: {
    all: ["templates"] as const,
    detail: (id: string) => ["templates", "detail", id] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
    members: (id: string) => ["organizations", "members", id] as const,
    invitations: (id: string) => ["organizations", "invitations", id] as const,
    credentials: (id: string) => ["organizations", "credentials", id] as const,
  },
};
