import { Navbar } from "@/components/navbar";
import { Hero } from "@/features/landing/hero";
import { Features } from "@/features/landing/features";
import { CTA } from "@/features/landing/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
