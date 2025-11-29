import { 
  LayoutGrid, 
  FileText, 
  History, 
  Settings, 
  Users, 
  CreditCard, 
  Database,
  Activity,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react";

export const currentUser = {
  name: "Alice Engineer",
  email: "alice@acme.com",
  avatar: "https://github.com/shadcn.png",
  role: "Senior Architect"
};

export const workspaces = [
  { 
    id: "1", 
    name: "Acme Corp", 
    plan: "Pro", 
    members: 5, 
    role: "Owner",
    description: "Main workspace for Acme Corp engineering team"
  },
  { 
    id: "2", 
    name: "Personal Projects", 
    plan: "Free", 
    members: 1, 
    role: "Owner",
    description: "My personal experiments and learning"
  },
  { 
    id: "3", 
    name: "Freelance Client A", 
    plan: "Team", 
    members: 3, 
    role: "Member",
    description: "Contract work for Client A"
  },
];

export const recentCanvases = [
  { 
    id: "1", 
    name: "Customer Support Agent", 
    updatedAt: "2 hours ago", 
    nodes: 12, 
    tags: ["RAG", "Agent"],
    thumbnail: "/placeholders/canvas-1.png",
    description: "Automated support agent with knowledge base retrieval."
  },
  { 
    id: "2", 
    name: "Legal Document Analyzer", 
    updatedAt: "1 day ago", 
    nodes: 8,
    tags: ["Analysis", "PDF"],
    thumbnail: "/placeholders/canvas-2.png",
    description: "Analyzes legal contracts for risky clauses."
  },
  { 
    id: "3", 
    name: "Email Drafter", 
    updatedAt: "3 days ago", 
    nodes: 5,
    tags: ["Productivity"],
    thumbnail: "/placeholders/canvas-3.png",
    description: "Drafts responses to common customer emails."
  },
  { 
    id: "4", 
    name: "Code Reviewer", 
    updatedAt: "1 week ago", 
    nodes: 15,
    tags: ["DevTool"],
    thumbnail: "/placeholders/canvas-4.png",
    description: "Automated code review pipeline using LLMs."
  },
];

export const recentRuns = [
  {
    id: "run-123",
    canvasName: "Customer Support Agent",
    status: "success",
    duration: "1.2s",
    startedAt: "2 mins ago",
    cost: "$0.02"
  },
  {
    id: "run-124",
    canvasName: "Legal Document Analyzer",
    status: "failed",
    duration: "5.4s",
    startedAt: "15 mins ago",
    cost: "$0.15"
  },
  {
    id: "run-125",
    canvasName: "Customer Support Agent",
    status: "success",
    duration: "0.8s",
    startedAt: "1 hour ago",
    cost: "$0.01"
  },
  {
    id: "run-126",
    canvasName: "Email Drafter",
    status: "running",
    duration: "2.1s",
    startedAt: "Just now",
    cost: "..."
  }
];

export const documents = [
  {
    id: "doc-1",
    name: "Product Manual v2.pdf",
    size: "2.4 MB",
    chunks: 145,
    uploadedAt: "2 days ago",
    type: "PDF"
  },
  {
    id: "doc-2",
    name: "API Documentation.md",
    size: "45 KB",
    chunks: 12,
    uploadedAt: "5 days ago",
    type: "Markdown"
  },
  {
    id: "doc-3",
    name: "Q3 Financial Report.xlsx",
    size: "1.1 MB",
    chunks: 89,
    uploadedAt: "1 week ago",
    type: "Excel"
  }
];

export const activityFeed = [
  {
    id: "act-1",
    user: "Alice Engineer",
    action: "deployed",
    target: "Customer Support Agent",
    time: "2 hours ago"
  },
  {
    id: "act-2",
    user: "Bob Designer",
    action: "commented on",
    target: "Legal Document Analyzer",
    time: "4 hours ago"
  },
  {
    id: "act-3",
    user: "Charlie PM",
    action: "created",
    target: "New Workspace",
    time: "1 day ago"
  }
];

// Helper components for icons (simulated for data)

export const templates = [
  {
    id: "tmpl-1",
    name: "Naive RAG",
    description: "Basic retrieval augmented generation pipeline. Good starting point.",
    difficulty: "Beginner",
    nodes: 4,
    tags: ["RAG", "Basic"]
  },
  {
    id: "tmpl-2",
    name: "HyDE (Hypothetical Document Embeddings)",
    description: "Generates a hypothetical answer to improve retrieval for ambiguous queries.",
    difficulty: "Intermediate",
    nodes: 6,
    tags: ["Advanced RAG", "HyDE"]
  },
  {
    id: "tmpl-3",
    name: "Corrective RAG (CRAG)",
    description: "Includes a self-correction mechanism to filter irrelevant retrieved documents.",
    difficulty: "Advanced",
    nodes: 9,
    tags: ["Advanced RAG", "Agentic"]
  },
  {
    id: "tmpl-4",
    name: "Multi-Hop Question Answering",
    description: "Breaks down complex questions into sub-questions for iterative retrieval.",
    difficulty: "Expert",
    nodes: 12,
    tags: ["Agentic", "Complex"]
  }
];

