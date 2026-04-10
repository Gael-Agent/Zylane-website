"use client";

import type { Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  femmes: "Femmes",
  hommes: "Hommes",
  enfants: "Enfants",
  barbe: "Barbe",
};

const categoryIcons: Record<string, string> = {
  femmes: "✂️",
  hommes: "💈",
  enfants: "👦",
  barbe: "🪒",
};

export default function StepService({
  services,
  onSelect,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
}) {
  // Group by category
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-lg text-center" style={{ color: "var(--color-muted)" }}>
        Quel service souhaitez-vous ?
      </p>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3
            className="text-xl font-bold mb-3 flex items-center gap-2"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
          >
            <span>{categoryIcons[category] || ""}</span>
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-2">
            {items.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelect(service)}
                className="w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors min-h-[56px]"
                style={{
                  background: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <div>
                  <span className="text-lg font-medium">{service.name}</span>
                  <span className="text-sm ml-2" style={{ color: "var(--color-muted)" }}>
                    ~{service.duration_minutes} min
                  </span>
                </div>
                <span className="font-semibold whitespace-nowrap" style={{ color: "var(--color-accent)" }}>
                  {service.price_display}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
