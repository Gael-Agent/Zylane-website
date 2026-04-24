import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

const FROM = "Zylane Coiffeur <noreply@zylanecoiffure.com>";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("fr-CH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  return time.substring(0, 5).replace(":", "h");
}

export async function sendBookingConfirmation(params: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  workerName: string;
  cancelUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: [params.to],
    subject: "Confirmation de votre rendez-vous — Zylane",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Rendez-vous confirmé !</h2>
        <p>Bonjour ${params.clientName},</p>
        <p>Votre rendez-vous chez Zylane Coiffeur Barbier est confirmé :</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Service</td><td style="padding: 8px; font-weight: bold;">${params.serviceName}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px; font-weight: bold;">${formatDate(params.date)}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Heure</td><td style="padding: 8px; font-weight: bold;">${formatTime(params.startTime)}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Avec</td><td style="padding: 8px; font-weight: bold;">${params.workerName}</td></tr>
        </table>
        <p>📍 Route du Grand-Mont 16, 1052 Le Mont-sur-Lausanne</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 14px; color: #888;">
          Besoin d'annuler ? <a href="${params.cancelUrl}" style="color: #c9a96e;">Cliquez ici</a>
        </p>
      </div>
    `,
  });
}

