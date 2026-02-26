"use client";

import { useTemplates } from "@/features/templates/hooks";
import { TemplateCard } from "./template-card";
import { Loader2 } from "lucide-react";

export const TemplatesGrid = () => {
  const { data: templates, isLoading, error } = useTemplates();

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-muted-foreground">
            Failed to load templates. Please try again later.
          </div>
        )}

        {templates && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
