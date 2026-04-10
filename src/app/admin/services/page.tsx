import { getAdminServices, createService, updateService } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const categories = [
  { value: "femmes", label: "Femmes" },
  { value: "hommes", label: "Hommes" },
  { value: "enfants", label: "Enfants" },
  { value: "barbe", label: "Barbe" },
];

export default async function ServicesPage() {
  const services = await getAdminServices();

  async function handleCreate(formData: FormData) {
    "use server";
    await createService({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      duration_minutes: parseInt(formData.get("duration") as string),
      price_display: formData.get("price") as string,
    });
    redirect("/admin/services");
  }

  async function handleToggle(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const current = formData.get("is_active") === "true";
    await updateService(id, { is_active: !current });
    redirect("/admin/services");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
        Services
      </h1>

      {/* Add service form */}
      <form action={handleCreate} className="rounded-xl border p-6 mb-8" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Ajouter un service</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input name="name" placeholder="Nom du service" required className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
          <select name="category" required className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}>
            <option value="">Catégorie...</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input name="duration" type="number" placeholder="Durée (minutes)" required min="5" step="5" className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
          <input name="price" placeholder="Prix (ex: Dès CHF 30)" required className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
        </div>
        <button type="submit" className="px-6 py-3 rounded-lg text-white font-semibold min-h-[48px]" style={{ background: "var(--color-accent)" }}>
          Ajouter
        </button>
      </form>

      {/* Services list */}
      <div className="space-y-2">
        {(services || []).map((service: any) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)", opacity: service.is_active ? 1 : 0.5 }}
          >
            <div>
              <span className="text-lg font-medium" style={{ color: "var(--color-foreground)" }}>
                {service.name}
              </span>
              <span className="text-sm ml-3" style={{ color: "var(--color-muted)" }}>
                {service.category} · {service.duration_minutes} min · {service.price_display}
              </span>
            </div>
            <form action={handleToggle}>
              <input type="hidden" name="id" value={service.id} />
              <input type="hidden" name="is_active" value={String(service.is_active)} />
              <button type="submit" className="px-4 py-2 rounded-lg border text-sm min-h-[40px]" style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}>
                {service.is_active ? "Désactiver" : "Activer"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
