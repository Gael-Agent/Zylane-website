import { getWorkers, createWorker, updateWorker, setWorkerSchedule } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const skillOptions = [
  { value: "femmes", label: "Femmes" },
  { value: "hommes", label: "Hommes" },
  { value: "enfants", label: "Enfants" },
];

export default async function WorkersPage() {
  const workers = await getWorkers();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const skills = formData.getAll("skills") as string[];
    await createWorker({ name, skills, email });
    redirect("/admin/workers");
  }

  async function handleToggle(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const current = formData.get("is_active") === "true";
    await updateWorker(id, { is_active: !current });
    redirect("/admin/workers");
  }

  async function handleSchedule(formData: FormData) {
    "use server";
    const workerId = formData.get("worker_id") as string;
    const schedules: { day_of_week: number; start_time: string; end_time: string }[] = [];
    for (let d = 0; d <= 6; d++) {
      const enabled = formData.get(`day_${d}_enabled`);
      if (enabled) {
        const start = formData.get(`day_${d}_start`) as string;
        const end = formData.get(`day_${d}_end`) as string;
        if (start && end) {
          schedules.push({ day_of_week: d, start_time: start, end_time: end });
        }
      }
    }
    await setWorkerSchedule(workerId, schedules);
    redirect("/admin/workers");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
        Employés
      </h1>

      {/* Add worker form */}
      <form action={handleCreate} className="rounded-xl border p-6 mb-8 space-y-4" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
        <h2 className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>Ajouter un employé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input name="name" placeholder="Nom" required className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
          <input name="email" type="email" placeholder="Email (optionnel)" className="rounded-lg px-4 min-h-[48px] border text-base" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
          <div className="flex items-center gap-4">
            {skillOptions.map((s) => (
              <label key={s.value} className="flex items-center gap-1 text-base" style={{ color: "var(--color-foreground)" }}>
                <input type="checkbox" name="skills" value={s.value} className="w-5 h-5" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="px-6 py-3 rounded-lg text-white font-semibold min-h-[48px]" style={{ background: "var(--color-accent)" }}>
          Ajouter
        </button>
      </form>

      {/* Worker list */}
      <div className="space-y-6">
        {(workers || []).map((worker: any) => (
          <div key={worker.id} className="rounded-xl border p-6" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold" style={{ color: worker.is_active ? "var(--color-foreground)" : "var(--color-muted)" }}>
                  {worker.name} {!worker.is_active && "(inactif)"}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {worker.skills.join(", ")} {worker.email && `· ${worker.email}`}
                </p>
              </div>
              <form action={handleToggle}>
                <input type="hidden" name="id" value={worker.id} />
                <input type="hidden" name="is_active" value={String(worker.is_active)} />
                <button type="submit" className="px-4 py-2 rounded-lg border text-sm min-h-[40px]" style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}>
                  {worker.is_active ? "Désactiver" : "Activer"}
                </button>
              </form>
            </div>

            {/* Schedule form */}
            <form action={handleSchedule} className="space-y-2">
              <input type="hidden" name="worker_id" value={worker.id} />
              <p className="text-sm font-medium mb-2" style={{ color: "var(--color-muted)" }}>Horaires :</p>
              {[2, 3, 4, 5, 6].map((d) => {
                const existing = worker.schedules?.find((s: any) => s.day_of_week === d);
                return (
                  <div key={d} className="flex items-center gap-3 text-base">
                    <label className="flex items-center gap-2 w-20" style={{ color: "var(--color-foreground)" }}>
                      <input type="checkbox" name={`day_${d}_enabled`} defaultChecked={!!existing} value="1" className="w-5 h-5" />
                      {dayNames[d]}
                    </label>
                    <input type="time" name={`day_${d}_start`} defaultValue={existing?.start_time?.substring(0, 5) || "08:30"} className="rounded px-2 min-h-[40px] border text-sm" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
                    <span style={{ color: "var(--color-muted)" }}>–</span>
                    <input type="time" name={`day_${d}_end`} defaultValue={existing?.end_time?.substring(0, 5) || "18:30"} className="rounded px-2 min-h-[40px] border text-sm" style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }} />
                  </div>
                );
              })}
              <button type="submit" className="mt-2 px-4 py-2 rounded-lg border text-sm min-h-[40px] font-medium" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
                Sauvegarder les horaires
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
