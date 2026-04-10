"use client";

import { useState, FormEvent } from "react";
import { salonInfo, serviceCategories } from "@/lib/data";

export default function Booking() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Build flat list of services from categories
  const allServices = serviceCategories.flatMap((cat) =>
    cat.services.map((s) => `${cat.title} — ${s.name}`)
  );

  // Get tomorrow's date as min for date input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    if (!salonInfo.formspreeId) {
      // No Formspree configured — show placeholder message
      setStatus("error");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`https://formspree.io/f/${salonInfo.formspreeId}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="reserver" className="py-20 sm:py-28" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-2xl p-8 sm:p-12 border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
              Demande envoyée !
            </h2>
            <p className="text-lg" style={{ color: "var(--color-muted)" }}>
              Nous vous contacterons rapidement pour confirmer votre rendez-vous.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 px-6 py-3 rounded-lg text-white font-semibold min-h-[48px] hover:opacity-90 transition-opacity"
              style={{ background: "var(--color-accent)" }}
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reserver" className="py-20 sm:py-28" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
            Prendre rendez-vous
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
          <p className="text-lg" style={{ color: "var(--color-muted)" }}>
            Remplissez le formulaire et nous vous confirmerons votre créneau
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 border space-y-6" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
          {/* Service */}
          <div>
            <label htmlFor="service" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
              Service souhaité
            </label>
            <select
              id="service"
              name="service"
              required
              className="w-full rounded-lg px-4 min-h-[48px] border text-base"
              style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
            >
              <option value="">Choisir un service...</option>
              {allServices.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
                Date souhaitée
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                min={minDate}
                className="w-full rounded-lg px-4 min-h-[48px] border text-base"
                style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
                Heure préférée
              </label>
              <select
                id="time"
                name="time"
                required
                className="w-full rounded-lg px-4 min-h-[48px] border text-base"
                style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
              >
                <option value="">Choisir...</option>
                <option value="Matin (8h30-12h)">Matin (8h30–12h)</option>
                <option value="Début après-midi (12h-15h)">Début d&apos;après-midi (12h–15h)</option>
                <option value="Fin après-midi (15h-18h30)">Fin d&apos;après-midi (15h–18h30)</option>
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
              Votre nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Prénom et nom"
              className="w-full rounded-lg px-4 min-h-[48px] border text-base"
              style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
              Téléphone ou email
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              required
              placeholder="Pour vous confirmer le rendez-vous"
              className="w-full rounded-lg px-4 min-h-[48px] border text-base"
              style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
              Message <span style={{ color: "var(--color-muted)" }}>(optionnel)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Précisions, demandes particulières..."
              className="w-full rounded-lg px-4 py-3 border text-base resize-none"
              style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-4 rounded-lg text-white text-lg font-semibold min-h-[56px] hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-accent)" }}
          >
            {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
          </button>

          {status === "error" && !salonInfo.formspreeId && (
            <p className="text-center text-base" style={{ color: "var(--color-muted)" }}>
              La réservation en ligne sera bientôt disponible. En attendant, passez directement au salon au {salonInfo.address.street}, {salonInfo.address.city}.
            </p>
          )}

          {status === "error" && salonInfo.formspreeId && (
            <p className="text-center text-base text-red-400">
              Une erreur est survenue. Veuillez réessayer ou passer directement au salon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
