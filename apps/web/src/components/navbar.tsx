import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-lg">Hachi</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Features
          </Link>
          <Link
            href="/templates"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Templates
          </Link>
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:shadow-primary/25"
          >
            Open Canvas
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
