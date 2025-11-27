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
  FeaturesCTA,
} from "@/features/features-page";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FeaturesHero />
      <VisualCanvasSection />
      <WireTapSection />
      <ExecutionSection />
      <CollaborationSection />
      <AdvancedPatternsSection />
      <IntegrationsSection />
      <FeaturesCTA />
      <Footer />
    </main>
  );
}
