import { TemplatesHero, TemplatesGrid, TemplatesCTA } from "@/features/templates-page";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <TemplatesHero />
      <TemplatesGrid />
      <TemplatesCTA />
    </main>
  );
}
