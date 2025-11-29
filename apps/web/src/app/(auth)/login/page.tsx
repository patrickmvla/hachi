"use client";

import Link from "next/link";
import { Github, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors font-medium">
          <Github size={20} />
          Continue with GitHub
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Link href="#" className="text-xs text-[var(--primary)] hover:underline">Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button className="w-full py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors">
            Sign In
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--muted-foreground)]">Don't have an account? </span>
        <Link href="/signup" className="text-[var(--primary)] font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
