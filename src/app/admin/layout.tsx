import { isAdminAuthenticated } from "@/lib/admin-actions";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

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
