import { serviceCategories } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28" style={{ background: "var(--color-bg-alt)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
          >
            Nos Services
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
          <p className="text-lg" style={{ color: "var(--color-muted)" }}>
            Des soins professionnels pour toute la famille
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {serviceCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl p-6 sm:p-8 border"
              style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {category.icon}
                </span>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
                >
                  {category.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {category.services.map((service) => (
                  <li
                    key={service.name}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-lg" style={{ color: "var(--color-foreground)" }}>
                      {service.name}
                    </span>
                    <span className="flex-shrink-0 border-b border-dotted flex-grow mx-2" style={{ borderColor: "var(--color-border)" }} />
                    <span className="font-semibold text-lg whitespace-nowrap" style={{ color: "var(--color-accent)" }}>
                      {service.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-base" style={{ color: "var(--color-muted)" }}>
          * Les prix indiqués sont des prix de base. Le tarif exact peut varier selon la prestation.
        </p>
      </div>
    </section>
  );
}
