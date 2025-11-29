"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function NewWorkspacePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("");

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/workspaces" 
          className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create New Workspace</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${step >= 1 ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)]"}`}>
            1
          </div>
          <span className="text-sm font-medium">Details</span>
        </div>
        <div className="h-px bg-[var(--border)] flex-1" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${step >= 2 ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)]"}`}>
            2
          </div>
          <span className="text-sm font-medium">Use Case</span>
        </div>
        <div className="h-px bg-[var(--border)] flex-1" />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${step >= 3 ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)]"}`}>
            3
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-2">Workspace Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Engineering"
                className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                autoFocus
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                This will be the name of your team's shared environment.
              </p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!name}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-4">What are you building?</label>
              <div className="space-y-3">
                {['Internal Knowledge Base', 'Customer Support Agent', 'Document Analysis', 'Research Assistant', 'Other'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setUseCase(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                      useCase === option 
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]" 
                        : "border-[var(--border)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    {useCase === option && <Check size={16} className="text-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!useCase}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                {name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold mb-1">{name}</h2>
              <p className="text-[var(--muted-foreground)]">{useCase}</p>
            </div>

            <div className="bg-[var(--muted)]/50 rounded-lg p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Plan</span>
                <span className="font-medium">Free Trial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Members</span>
                <span className="font-medium">1 (You)</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Back
              </button>
              <button 
                className="flex items-center gap-2 px-8 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/20"
              >
                Create Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
