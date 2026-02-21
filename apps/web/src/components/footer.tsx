import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-black border-t border-white/[0.06]">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-6 rounded-[4px] bg-white flex items-center justify-center">
                <span className="text-black font-bold text-[10px]">H</span>
              </div>
              <span className="font-bold text-[14px] text-white/80">hachi</span>
            </Link>
            <span className="text-[12px] text-white/20">Visual RAG Architecture Platform</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[12px] text-white/25">
            <Link href="/features" className="hover:text-white/60 transition-colors">Features</Link>
            <Link href="/templates" className="hover:text-white/60 transition-colors">Templates</Link>
            <Link href="/mini-map" className="hover:text-white/60 transition-colors">Playground</Link>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
