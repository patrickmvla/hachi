import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">H</span>
            </div>
            <span className="font-semibold">Hachi</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            Visual Architecture Platform for RAG Systems
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hachi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/templates" className="hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="/canvas" className="hover:text-foreground transition-colors">
              Canvas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
