"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Create an account</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Get started with Hachi today
        </p>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors font-medium">
          <Github size={20} />
          Sign up with GitHub
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">Or sign up with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                type="text"
                className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
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
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button className="w-full py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors">
            Create Account
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--muted-foreground)]">Already have an account? </span>
        <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
