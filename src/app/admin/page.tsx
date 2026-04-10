import { getAdminBookings, cancelAdminBooking } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-CH", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(time: string): string {
  return time.substring(0, 5).replace(":", "h");
}

export default async function AdminDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
  const bookings = await getAdminBookings(today, twoWeeks);

  const confirmed = bookings.filter((b: any) => b.status === "confirmed");
  const cancelled = bookings.filter((b: any) => b.status === "cancelled");

  async function handleCancel(formData: FormData) {
    "use server";
    const id = formData.get("bookingId") as string;
    await cancelAdminBooking(id);
    redirect("/admin");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
        Rendez-vous à venir
      </h1>

      {confirmed.length === 0 && (
        <p style={{ color: "var(--color-muted)" }}>Aucun rendez-vous à venir.</p>
      )}

      <div className="space-y-3">
        {confirmed.map((booking: any) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}
          >
            <div>
              <p className="text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
                {booking.client_name} — {booking.services?.name}
              </p>
              <p style={{ color: "var(--color-muted)" }}>
                {formatDate(booking.date)} à {formatTime(booking.start_time)} · {booking.workers?.name}
              </p>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Contact: {booking.client_contact}
              </p>
            </div>
            <form action={handleCancel}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border text-sm min-h-[40px]"
                style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}
              >
                Annuler
              </button>
            </form>
          </div>
        ))}
      </div>

      {cancelled.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-base" style={{ color: "var(--color-muted)" }}>
            {cancelled.length} annulation(s) récente(s)
          </summary>
          <div className="space-y-2 mt-3 opacity-50">
            {cancelled.map((booking: any) => (
              <div
                key={booking.id}
                className="p-3 rounded-lg border line-through"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span style={{ color: "var(--color-muted)" }}>
                  {booking.client_name} — {booking.services?.name} — {formatDate(booking.date)}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
