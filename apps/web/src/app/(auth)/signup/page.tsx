"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { signupSchema, type SignupFormData } from "@/features/auth/schema/signup";

const PIPELINE_STEPS = [
  { id: "Q", label: "Query", color: "#2563eb" },
  { id: "E", label: "Embed", color: "#7c3aed" },
  { id: "R", label: "Retrieve", color: "#059669" },
  { id: "G", label: "Generate", color: "#d97706" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? -1 : prev + 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);

    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
      });

      if (error) {
        setServerError(error.message || "Failed to create account. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("An error occurred. Please try again.");
    }
  };

  const handleGitHubSignUp = async () => {
    setIsGitHubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch {
      setServerError("Failed to sign up with GitHub. Please try again.");
      setIsGitHubLoading(false);
    }
  };

  const disabled = isSubmitting || isGitHubLoading;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — Form Panel */}
      <div className="relative flex items-center justify-center px-6 py-12">
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative w-full max-w-[420px] mx-auto">
          {/* Logo */}
          <div
            className="mb-10"
            style={mounted ? { animation: "fadeInUp 0.7s ease-out forwards" } : { opacity: 0 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative size-7 rounded-[6px] bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-tight">H</span>
              </div>
              <span className="font-bold text-[15px] tracking-tight text-black">hachi</span>
            </Link>
          </div>

          {/* Heading */}
          <div
            className="mb-8"
            style={mounted ? { animation: "fadeInUp 0.7s ease-out 80ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em] leading-[1.1] text-black mb-2">
              Create an account
            </h1>
            <p className="text-[15px] text-black/45">
              Get started with Hachi today
            </p>
          </div>

          {/* Error */}
          {serverError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200/60 text-red-700 text-sm" role="alert">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={mounted ? { animation: "fadeInUp 0.7s ease-out 160ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first-name" className="block text-[13px] font-medium text-black/70 mb-1.5">
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    {...register("firstName")}
                    aria-invalid={!!errors.firstName}
                    className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06] ${
                      errors.firstName ? "border-red-400" : "border-black/[0.08]"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-[13px] font-medium text-black/70 mb-1.5">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    {...register("lastName")}
                    aria-invalid={!!errors.lastName}
                    className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06] ${
                      errors.lastName ? "border-red-400" : "border-black/[0.08]"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-black/70 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06] ${
                    errors.email ? "border-red-400" : "border-black/[0.08]"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-black/70 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/20 focus:ring-2 focus:ring-black/[0.06] ${
                    errors.password ? "border-red-400" : "border-black/[0.08]"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={disabled}
                className="w-full h-11 rounded-full bg-black text-white text-[14px] font-semibold hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[12px] text-black/30 uppercase tracking-wide">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={handleGitHubSignUp}
              className="w-full h-11 rounded-full border border-black/10 bg-white text-[14px] font-medium text-black/70 hover:border-black/20 hover:text-black hover:bg-black/[0.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Github className="size-4" aria-hidden="true" />
              Sign up with GitHub
            </button>
          </form>

          {/* Footer links */}
          <div
            className="mt-8 space-y-4"
            style={mounted ? { animation: "fadeInUp 0.7s ease-out 240ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            <p className="text-center text-[13px] text-black/40">
              Already have an account?{" "}
              <Link href="/login" className="text-black/70 hover:text-black underline underline-offset-4 transition-colors">
                Sign in
              </Link>
            </p>
            <p className="text-center text-[11px] text-black/25">
              By continuing, you agree to our{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-black/40 transition-colors">Terms</Link>{" "}
              and{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-black/40 transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Right — Branding Panel */}
      <div className="relative hidden lg:flex items-center justify-center bg-black overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Soft gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.04] rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-[440px] mx-auto px-8">
          {/* Tagline */}
          <div
            className="mb-10"
            style={mounted ? { animation: "fadeInUp 0.7s ease-out 300ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] mb-6">
              <div className="size-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12px] tracking-wide text-white/50 uppercase">Visual RAG Architecture Platform</span>
            </div>
            <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold tracking-[-0.03em] leading-[1.1] text-white">
              Design RAG pipelines<br />
              <span className="text-white/50">you can see through</span>
            </h2>
          </div>

          {/* Pipeline card */}
          <div
            style={mounted ? { animation: "fadeInUp 0.8s ease-out 450ms forwards", opacity: 0 } : { opacity: 0 }}
          >
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="size-[7px] rounded-full bg-white/15" />
                  <div className="size-[7px] rounded-full bg-white/15" />
                  <div className="size-[7px] rounded-full bg-white/15" />
                </div>
                <span className="text-[10px] text-white/25 tracking-wide">naive-rag.hachi</span>
                <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                  <div className="size-1.5 rounded-full bg-emerald-400" />
                  ready
                </div>
              </div>

              {/* Pipeline flow */}
              <div className="px-5 py-8">
                <div className="flex items-center justify-between">
                  {PIPELINE_STEPS.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="relative size-10 rounded-lg border-2 flex items-center justify-center transition-all duration-500"
                          style={{
                            borderColor: activeStep >= i ? step.color : "rgba(255,255,255,0.08)",
                            backgroundColor: activeStep >= i ? `${step.color}15` : "transparent",
                            boxShadow: activeStep === i ? `0 0 0 3px ${step.color}20, 0 4px 12px ${step.color}25` : "none",
                          }}
                        >
                          <span
                            className="text-xs font-bold transition-colors duration-500"
                            style={{ color: activeStep >= i ? step.color : "rgba(255,255,255,0.2)" }}
                          >
                            {step.id}
                          </span>
                        </div>
                        <span
                          className="text-[9px] tracking-wide uppercase transition-colors duration-500"
                          style={{ color: activeStep >= i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }}
                        >
                          {step.label}
                        </span>
                      </div>

                      {i < PIPELINE_STEPS.length - 1 && (
                        <div className="flex-1 h-[2px] rounded-full bg-white/[0.06] relative mx-1 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: activeStep > i ? "100%" : "0%",
                              backgroundColor: PIPELINE_STEPS[i + 1]?.color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01]">
                <span className="text-[10px] text-white/20">4 nodes &middot; 3 connections</span>
                <span className="text-[10px] text-emerald-400/70 font-medium">pipeline healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
