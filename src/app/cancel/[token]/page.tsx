import { cancelBooking } from "@/lib/booking-actions";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function CancelPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Fetch booking info
  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("*, services(name)")
    .eq("cancel_token", token)
    .single();

  if (!booking) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
            Réservation introuvable
          </h1>
          <p style={{ color: "var(--color-muted)" }}>
            Ce lien d&apos;annulation n&apos;est plus valide.
          </p>
          <a href="/" className="mt-6 inline-block underline" style={{ color: "var(--color-accent)" }}>
            Retour à l&apos;accueil
          </a>
        </div>
      </main>
    );
  }

  if (booking.status === "cancelled") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
            Déjà annulé
          </h1>
          <p style={{ color: "var(--color-muted)" }}>
            Ce rendez-vous a déjà été annulé.
          </p>
          <a href="/" className="mt-6 inline-block underline" style={{ color: "var(--color-accent)" }}>
            Retour à l&apos;accueil
          </a>
        </div>
      </main>
    );
  }

  // Cancel it
  const result = await cancelBooking(token);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="text-center p-8 max-w-md">
        {result.success ? (
          <>
            <div className="text-5xl mb-6">✓</div>
            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
              Rendez-vous annulé
            </h1>
            <p style={{ color: "var(--color-muted)" }}>
              Votre rendez-vous pour {(booking as any).services?.name || "votre service"} a été annulé avec succès.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
              Erreur
            </h1>
            <p style={{ color: "var(--color-muted)" }}>{result.error}</p>
          </>
        )}
        <a href="/" className="mt-6 inline-block underline" style={{ color: "var(--color-accent)" }}>
          Retour à l&apos;accueil
        </a>
      </div>
    </main>
  );
}
