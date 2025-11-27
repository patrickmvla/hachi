import { TemplateCard } from "./template-card";
import { templates } from "./templates-data";

export function TemplatesGrid() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Filter tabs - could be expanded later */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground">
            All
          </button>
          <button className="px-3 py-1.5 text-sm rounded-lg border hover:bg-accent transition-colors">
            Beginner
          </button>
          <button className="px-3 py-1.5 text-sm rounded-lg border hover:bg-accent transition-colors">
            Intermediate
          </button>
          <button className="px-3 py-1.5 text-sm rounded-lg border hover:bg-accent transition-colors">
            Advanced
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </section>
  );
}
