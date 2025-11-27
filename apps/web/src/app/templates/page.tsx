import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TemplatesHero, TemplatesGrid, TemplatesCTA } from "@/features/templates-page";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <TemplatesHero />
      <TemplatesGrid />
      <TemplatesCTA />
      <Footer />
    </main>
  );
}
