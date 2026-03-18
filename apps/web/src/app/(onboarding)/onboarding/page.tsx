"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Loader2,
  Mail,
  Plus,
  Trash2,
  Layers,
  Lightbulb,
  Search,
  Zap,
  FileText,
  Users,
} from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useTemplates } from "@/features/templates/hooks/use-template-queries";
import { createCanvas } from "@/features/canvas/api/canvas-api";
import { isPersonalEmail } from "@/features/auth/schema/email";

const STEPS = [
  { label: "Welcome", number: "01" },
  { label: "Workspace", number: "02" },
  { label: "Invite", number: "03" },
  { label: "Template", number: "04" },
] as const;

const USE_CASES = [
  { label: "Internal Knowledge Base", color: "#2563eb", icon: Layers },
  { label: "Customer Support Agent", color: "#7c3aed", icon: Users },
  { label: "Document Analysis", color: "#059669", icon: Search },
  { label: "Research Assistant", color: "#d97706", icon: Lightbulb },
  { label: "Other", color: "#6b7280", icon: Zap },
];

const TEMPLATE_COLORS: Record<string, string> = {
  "tmpl-1": "#2563eb",
  "tmpl-2": "#7c3aed",
  "tmpl-3": "#059669",
  "tmpl-4": "#d97706",
};

const SLUG_REPLACE_RE = /[^a-z0-9]+/g;
const SLUG_TRIM_RE = /^-|-$/g;


type InviteRole = "admin" | "editor" | "viewer";
type Invite = { email: string; role: InviteRole };
type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: templates } = useTemplates();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<Step>(1);

  // Step 2 — org fields
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [useCase, setUseCase] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 3 — invite fields
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("editor");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  // Step 4 — template
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If user already has an active org on initial load, go to dashboard.
  // Once onboarding starts (org created in step 2), don't redirect.
  const activeOrgId = activeOrg?.id;
  useEffect(() => {
    if (activeOrgId && !createdOrgId) {
      router.replace("/dashboard");
    }
  }, [activeOrgId, createdOrgId, router]);

  // Auto-suggest domain from email (only for business domains)
  // Adjust state during render instead of useEffect (react.dev/learn/you-might-not-need-an-effect)
  const userEmail = session?.user?.email;
  const [prevUserEmail, setPrevUserEmail] = useState<string | undefined>();
  if (userEmail && userEmail !== prevUserEmail) {
    setPrevUserEmail(userEmail);
    if (!domain && !isPersonalEmail(userEmail)) {
      const emailDomain = userEmail.split("@")[1]?.toLowerCase();
      if (emailDomain) setDomain(emailDomain);
    }
  }

  const slug = name
    .toLowerCase()
    .replace(SLUG_REPLACE_RE, "-")
    .replace(SLUG_TRIM_RE, "");

  const firstName = isSessionPending
    ? "\u00A0"
    : session?.user?.name?.split(" ")[0] ||
      session?.user?.email?.split("@")[0] ||
      "there";

  // --- Step handlers ---

  const handleCreateOrg = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    setError(null);

    try {
      const { data, error: apiError } =
        await authClient.organization.create({
          name: name.trim(),
          slug,
          metadata: { useCase },
          domain: domain.trim() || undefined,
        });

      if (apiError) {
        setError(apiError.message || "Failed to create organization");
        setIsCreating(false);
        return;
      }

      if (data) {
        await authClient.organization.setActive({
          organizationId: data.id,
        });
        setCreatedOrgId(data.id);
        setStep(3);
      }
    } catch {
      setError("Failed to create organization. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInvite = () => {
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    if (invites.some((i) => i.email === trimmed)) return;
    setInvites([...invites, { email: trimmed, role: inviteRole }]);
    setInviteEmail("");
  };

  const removeInvite = (email: string) => {
    setInvites(invites.filter((i) => i.email !== email));
  };

  const handleSendInvites = async () => {
    if (!createdOrgId || invites.length === 0) {
      setStep(4);
      return;
    }

    setIsSendingInvites(true);
    setError(null);

    try {
      await Promise.all(
        invites.map((invite) =>
          authClient.organization.inviteMember({
            email: invite.email,
            role: invite.role,
            organizationId: createdOrgId,
          })
        )
      );
      setStep(4);
    } catch {
      setError("Some invitations failed to send, but you can continue.");
      setStep(4);
    } finally {
      setIsSendingInvites(false);
    }
  };

  const handleFinish = async () => {
    if (!selectedTemplate) {
      router.push("/dashboard");
      return;
    }

    if (!createdOrgId) {
      router.push("/dashboard");
      return;
    }

    setIsFinishing(true);
    setError(null);

    try {
      const template = templates?.find((t) => t.id === selectedTemplate);
      const graph = template?.graphJson || { nodes: [], edges: [] };
      const canvas = await createCanvas(
        createdOrgId,
        template?.name || "Untitled Pipeline",
        graph
      );
      router.push(`/pipelines/${canvas.id}`);
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Grain texture — matches landing */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Geometric accent — top right */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] opacity-[0.04]">
        <svg viewBox="0 0 600 600" fill="none">
          <circle cx="600" cy="0" r="300" stroke="black" strokeWidth="1" />
          <circle cx="600" cy="0" r="200" stroke="black" strokeWidth="1" />
          <circle cx="600" cy="0" r="100" stroke="black" strokeWidth="1" />
        </svg>
      </div>

      {/* Geometric accent — bottom left */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] opacity-[0.03]">
        <svg viewBox="0 0 400 400" fill="none">
          <circle cx="0" cy="400" r="200" stroke="black" strokeWidth="1" />
          <circle cx="0" cy="400" r="130" stroke="black" strokeWidth="1" />
        </svg>
      </div>

      {/* Top bar with logo + progress */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="relative flex size-7 items-center justify-center rounded-[6px] bg-black">
            <span className="text-xs font-bold tracking-tight text-white">
              H
            </span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-black">
            hachi
          </span>
        </Link>

        {/* Step indicator — pill style */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {STEPS.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={s.label} className="flex items-center gap-1.5">
                <div
                  className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-all duration-300 ${
                    isCompleted
                      ? "bg-black text-white"
                      : isActive
                        ? "bg-black/[0.06] text-black"
                        : "text-black/25"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={2.5} />
                  ) : (
                    <span className="tabular-nums">{s.number}</span>
                  )}
                  <span>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-4 transition-colors duration-300 ${
                      isCompleted ? "bg-black/20" : "bg-black/[0.06]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Link
          href="/dashboard"
          className="text-[13px] text-black/30 transition-colors hover:text-black/60"
        >
          Skip setup
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[520px]">
          {error && (
            <div
              className="mb-6 rounded-xl border border-red-200/60 bg-red-50 p-3.5 text-[13px] text-red-700"
              role="alert"
              style={
                mounted
                  ? { animation: "fadeInUp 0.3s ease-out forwards" }
                  : { opacity: 0 }
              }
            >
              {error}
            </div>
          )}

          {/* ============ Step 1 — Welcome ============ */}
          {step === 1 && (
            <div className="text-center">
              <div
                className="mb-10"
                style={
                  mounted
                    ? {
                        animation:
                          "fadeInUp 0.7s ease-out forwards",
                      }
                    : { opacity: 0 }
                }
              >
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.12)]">
                  <span className="text-2xl font-bold text-white">H</span>
                </div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[12px] uppercase tracking-wide text-black/50">
                    Let&apos;s get you set up
                  </span>
                </div>
              </div>

              <h1
                className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-black"
                style={
                  mounted
                    ? {
                        animation:
                          "fadeInUp 0.7s ease-out 100ms forwards",
                        opacity: 0,
                      }
                    : { opacity: 0 }
                }
              >
                Welcome to Hachi,
                <br />
                {firstName}
              </h1>

              <p
                className="mx-auto mb-12 max-w-[400px] text-[16px] leading-relaxed text-black/40"
                style={
                  mounted
                    ? {
                        animation:
                          "fadeInUp 0.7s ease-out 200ms forwards",
                        opacity: 0,
                      }
                    : { opacity: 0 }
                }
              >
                Let&apos;s set up your workspace so you can start designing and
                debugging RAG pipelines.
              </p>

              <div
                className="flex flex-col items-center gap-4"
                style={
                  mounted
                    ? {
                        animation:
                          "fadeInUp 0.7s ease-out 300ms forwards",
                        opacity: 0,
                      }
                    : { opacity: 0 }
                }
              >
                <button
                  onClick={() => setStep(2)}
                  className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-black/85"
                >
                  Get Started
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <span className="text-[12px] text-black/25">
                  Takes about 2 minutes
                </span>
              </div>

              {/* Decorative pipeline preview */}
              <div
                className="mx-auto mt-16 max-w-[360px]"
                style={
                  mounted
                    ? {
                        animation:
                          "fadeInUp 0.8s ease-out 500ms forwards",
                        opacity: 0,
                      }
                    : { opacity: 0 }
                }
              >
                <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    {[
                      { letter: "Q", color: "#2563eb" },
                      { letter: "E", color: "#7c3aed" },
                      { letter: "R", color: "#059669" },
                      { letter: "G", color: "#d97706" },
                    ].map((node, i, arr) => (
                      <div
                        key={node.letter}
                        className="flex flex-1 items-center last:flex-none"
                      >
                        <div
                          className="flex size-10 items-center justify-center rounded-lg border-2"
                          style={{
                            borderColor: `${node.color}30`,
                            backgroundColor: `${node.color}08`,
                          }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: node.color }}
                          >
                            {node.letter}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            className="mx-2 h-[2px] flex-1 rounded-full"
                            style={{
                              backgroundColor: `${arr[i + 1]!.color}20`,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/[0.04] pt-3 text-[10px] text-black/25">
                    <span>4 nodes &middot; 3 connections</span>
                    <div className="flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-600">ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ Step 2 — Create Workspace ============ */}
          {step === 2 && (
            <div
              style={
                mounted
                  ? { animation: "fadeInUp 0.5s ease-out forwards" }
                  : { opacity: 0 }
              }
            >
              <span className="mb-5 block text-[12px] uppercase tracking-wide text-black/35">
                Step 02
              </span>
              <h2 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-black">
                Create your workspace
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-black/40">
                A workspace is where your team collaborates on RAG pipelines.
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="org-name"
                    className="mb-1.5 block text-[13px] font-medium text-black/70"
                  >
                    Organization Name
                  </label>
                  <input
                    id="org-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Engineering"
                    className="w-full rounded-lg border border-black/[0.08] bg-white px-4 py-2.5 text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06]"
                    autoFocus
                  />
                  {name && (
                    <p className="mt-1.5 text-[12px] text-black/30">
                      Slug:{" "}
                      <span className="font-mono text-black/50">{slug}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="org-domain"
                    className="mb-1.5 block text-[13px] font-medium text-black/70"
                  >
                    Email Domain{" "}
                    <span className="font-normal text-black/30">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="org-domain"
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acme.com"
                    className="w-full rounded-lg border border-black/[0.08] bg-white px-4 py-2.5 text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06]"
                  />
                  <p className="mt-1.5 text-[12px] text-black/30">
                    Users with this email domain will auto-join your
                    organization.
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-[13px] font-medium text-black/70">
                    What are you building?
                  </label>
                  <div
                    className="space-y-2"
                    role="radiogroup"
                    aria-label="Use case selection"
                  >
                    {USE_CASES.map((option) => {
                      const Icon = option.icon;
                      const isSelected = useCase === option.label;
                      return (
                        <button
                          key={option.label}
                          onClick={() => setUseCase(option.label)}
                          className={`group flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-black/[0.12] bg-black/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                              : "border-black/[0.06] hover:border-black/[0.12]"
                          }`}
                          role="radio"
                          aria-checked={isSelected}
                        >
                          <div
                            className="flex size-8 items-center justify-center rounded-lg transition-colors"
                            style={{
                              backgroundColor: isSelected
                                ? `${option.color}12`
                                : "rgba(0,0,0,0.03)",
                              color: isSelected
                                ? option.color
                                : "rgba(0,0,0,0.25)",
                            }}
                          >
                            <Icon size={15} />
                          </div>
                          <span
                            className={`flex-1 text-[14px] font-medium ${
                              isSelected ? "text-black" : "text-black/60"
                            }`}
                          >
                            {option.label}
                          </span>
                          {isSelected && (
                            <div
                              className="flex size-5 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${option.color}15`, color: option.color }}
                            >
                              <Check size={11} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-[13px] text-black/30 transition-colors hover:text-black/60"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateOrg}
                  disabled={!name.trim() || isCreating}
                  className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-2.5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-black/85 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============ Step 3 — Invite Teammates ============ */}
          {step === 3 && (
            <div
              style={
                mounted
                  ? { animation: "fadeInUp 0.5s ease-out forwards" }
                  : { opacity: 0 }
              }
            >
              <span className="mb-5 block text-[12px] uppercase tracking-wide text-black/35">
                Step 03
              </span>
              <h2 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-black">
                Invite your team
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-black/40">
                Collaboration is better together. You can always invite more
                people later.
              </p>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addInvite();
                        }
                      }}
                      className="w-full rounded-lg border border-black/[0.08] bg-white py-2.5 pl-10 pr-3 text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06]"
                      aria-label="Email address"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(
                        e.target.value as "admin" | "editor" | "viewer"
                      )
                    }
                    className="rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-black/70 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06]"
                    aria-label="Select role"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={addInvite}
                    disabled={!inviteEmail.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2.5 text-[13px] font-medium text-black/60 transition-all hover:border-black/20 hover:text-black disabled:opacity-30"
                    aria-label="Add invite"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                {invites.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-black/[0.06]">
                    {invites.map((invite, i) => (
                      <div
                        key={invite.email}
                        className={`flex items-center justify-between px-4 py-3 ${
                          i > 0 ? "border-t border-black/[0.04]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-black/[0.04] text-[12px] font-bold text-black/40">
                            {invite.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block text-[13px] font-medium text-black/80">
                              {invite.email}
                            </span>
                            <span className="text-[11px] capitalize text-black/30">
                              {invite.role}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeInvite(invite.email)}
                          className="rounded-md p-1.5 text-black/20 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${invite.email}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {invites.length === 0 && (
                  <div className="rounded-xl border border-dashed border-black/[0.08] px-6 py-10 text-center">
                    <Users
                      size={24}
                      className="mx-auto mb-3 text-black/15"
                    />
                    <p className="text-[13px] text-black/30">
                      Add teammate emails above to invite them
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="text-[13px] text-black/30 transition-colors hover:text-black/60"
                >
                  Skip this step
                </button>
                <button
                  onClick={handleSendInvites}
                  disabled={isSendingInvites}
                  className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-2.5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-black/85 disabled:opacity-40"
                >
                  {isSendingInvites ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : invites.length > 0 ? (
                    <>
                      Send Invites &amp; Continue
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============ Step 4 — Pick a Template ============ */}
          {step === 4 && (
            <div
              style={
                mounted
                  ? { animation: "fadeInUp 0.5s ease-out forwards" }
                  : { opacity: 0 }
              }
            >
              <span className="mb-5 block text-[12px] uppercase tracking-wide text-black/35">
                Step 04
              </span>
              <h2 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-black">
                Start with a template
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-black/40">
                Load a production-grade RAG pattern or start from scratch.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Blank pipeline option */}
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                    selectedTemplate === null
                      ? "border-black/[0.12] bg-black/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                      : "border-black/[0.06] hover:border-black/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  <div
                    className="mb-4 flex size-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        selectedTemplate === null
                          ? "rgba(0,0,0,0.06)"
                          : "rgba(0,0,0,0.03)",
                    }}
                  >
                    <FileText
                      size={18}
                      className={
                        selectedTemplate === null
                          ? "text-black/60"
                          : "text-black/25"
                      }
                    />
                  </div>
                  <h4 className="mb-1 text-[14px] font-bold text-black">
                    Blank Pipeline
                  </h4>
                  <p className="text-[12px] leading-relaxed text-black/35">
                    Start from an empty pipeline
                  </p>
                </button>

                {/* Template cards */}
                {templates?.map((template) => {
                  const color =
                    TEMPLATE_COLORS[template.id] || "#2563eb";
                  const isSelected =
                    selectedTemplate === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() =>
                        setSelectedTemplate(template.id)
                      }
                      className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-black/[0.12] bg-black/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                          : "border-black/[0.06] hover:border-black/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      <div
                        className="mb-4 flex size-10 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${color}${isSelected ? "12" : "08"}`,
                          color,
                        }}
                      >
                        <Layers size={18} />
                      </div>
                      <h4 className="mb-1 text-[14px] font-bold text-black">
                        {template.name}
                      </h4>
                      <p className="mb-4 text-[12px] leading-relaxed text-black/35">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-black/[0.04] pt-3 text-[11px]">
                        <span className="text-black/25">
                          {template.nodes} nodes &middot;{" "}
                          {template.difficulty}
                        </span>
                        {isSelected && (
                          <div
                            className="flex size-4 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${color}15`,
                              color,
                            }}
                          >
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (createdOrgId) setStep(3);
                    else router.push("/dashboard");
                  }}
                  className="text-[13px] text-black/30 transition-colors hover:text-black/60"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-2.5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-black/85 disabled:opacity-40"
                >
                  {isFinishing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Setting up...
                    </>
                  ) : selectedTemplate ? (
                    <>
                      Create &amp; Open Pipeline
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
