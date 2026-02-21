import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  FeaturesHero,
  VisualCanvasSection,
  WireTapSection,
  ExecutionSection,
  CollaborationSection,
  AdvancedPatternsSection,
  IntegrationsSection,
} from "@/features/features-page";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FeaturesHero />
      <VisualCanvasSection />
      <WireTapSection />
      <ExecutionSection />
      <CollaborationSection />
      <AdvancedPatternsSection />
      <IntegrationsSection />
      <Footer />
    </main>
  );
}
