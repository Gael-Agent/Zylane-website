import { isAdminAuthenticated, adminLogin } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

async function LoginForm() {
  async function handleLogin(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const success = await adminLogin(password);
    if (success) redirect("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm p-8 rounded-2xl border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
          Administration
        </h1>
        <form action={handleLogin}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            className="w-full rounded-lg px-4 min-h-[48px] border text-base mb-4"
            style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold min-h-[48px]"
            style={{ background: "var(--color-accent)" }}
          >
            Connexion
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  return (
    <div style={{ background: "var(--color-bg)" }} className="min-h-screen">
      {/* Admin nav */}
      <nav className="border-b px-4 sm:px-6" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-xl font-bold" style={{ color: "var(--color-accent)", fontFamily: "var(--heading-font)" }}>
              ZYLANE Admin
            </a>
            <a href="/admin" className="text-base min-h-[48px] flex items-center" style={{ color: "var(--color-muted)" }}>
              Rendez-vous
            </a>
            <a href="/admin/workers" className="text-base min-h-[48px] flex items-center" style={{ color: "var(--color-muted)" }}>
              Employés
            </a>
            <a href="/admin/services" className="text-base min-h-[48px] flex items-center" style={{ color: "var(--color-muted)" }}>
              Services
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm" style={{ color: "var(--color-muted)" }}>Voir le site</a>
            <form action={async () => { "use server"; const { adminLogout } = await import("@/lib/admin-actions"); await adminLogout(); redirect("/admin"); }}>
              <button type="submit" className="text-sm min-h-[48px]" style={{ color: "var(--color-muted)" }}>
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
