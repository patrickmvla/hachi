"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@hachi/auth/client";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative size-7 rounded-[6px] bg-black flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-tight">H</span>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-black">hachi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/features"
            className="px-3 py-1.5 text-[13px] text-black/50 hover:text-black transition-colors"
          >
            Features
          </Link>
          {session && (
            <Link
              href="/templates"
              className="px-3 py-1.5 text-[13px] text-black/50 hover:text-black transition-colors"
            >
              Templates
            </Link>
          )}
          <Link
            href="/mini-map"
            className="px-3 py-1.5 text-[13px] text-black/50 hover:text-black transition-colors"
          >
            Mini Map
          </Link>
          <div className="w-px h-4 bg-black/10 mx-2" />
          <Link
            href="/mini-map"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-full bg-black text-white hover:bg-black/80 transition-colors"
          >
            Try it out
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 -mr-2 text-black/60 hover:text-black transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            <Link
              href="/features"
              className="text-[14px] text-black/60 hover:text-black transition-colors px-3 py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            {session && (
              <Link
                href="/templates"
                className="text-[14px] text-black/60 hover:text-black transition-colors px-3 py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
            )}
            <Link
              href="/mini-map"
              className="text-[14px] text-black/60 hover:text-black transition-colors px-3 py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mini Map
            </Link>
            <div className="h-px bg-black/[0.06] my-2" />
            <Link
              href="/mini-map"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-full bg-black text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try it out
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
