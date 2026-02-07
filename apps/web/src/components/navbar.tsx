"use client";

import Link from "next/link";
import { ArrowRight, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@hachi/ui/components/button";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative size-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Hachi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/features"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            Features
          </Link>
          <Link
            href="/templates"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            Templates
          </Link>
          <div className="w-px h-6 bg-border/50 mx-2" />
          <ThemeToggle />
          <Link
            href="/sandbox"
            className="group relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg overflow-hidden ml-2"
          >
            {/* Button background */}
            <span className="absolute inset-0 bg-primary" />
            <span className="absolute inset-0 bg-linear-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Button content */}
            <span className="relative flex items-center gap-2 text-primary-foreground">
              <Zap className="size-3.5" />
              Open Canvas
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            <Link
              href="/features"
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all px-4 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/templates"
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all px-4 py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <div className="h-px bg-border/30 my-2" />
            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Zap className="size-3.5" />
              Open Canvas
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
