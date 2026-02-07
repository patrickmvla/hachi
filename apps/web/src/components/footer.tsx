import Link from "next/link";
import { Terminal } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border/30 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative size-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <span className="relative text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Hachi</span>
          </Link>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Terminal className="size-4" />
            <span>Visual Architecture Platform for RAG Systems</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hachi. All rights reserved.</p>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/features"
              className="hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/templates"
              className="hover:text-primary transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/sandbox"
              className="hover:text-primary transition-colors"
            >
              Canvas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
