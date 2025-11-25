import { Navbar } from "@/components/navbar";
import { Hero } from "@/features/landing/hero";
import { Problem } from "@/features/landing/problem";
import { Features } from "@/features/landing/features";
import { AdvancedNodes } from "@/features/landing/advanced-nodes";
import { Templates } from "@/features/landing/templates";
import { CTA } from "@/features/landing/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <AdvancedNodes />
      <Templates />
      <CTA />
      <Footer />
    </main>
  );
}
