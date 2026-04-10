"use client";

import { useState, FormEvent } from "react";
import type { Service, TimeSlot } from "@/lib/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  return time.substring(0, 5).replace(":", "h");
}

export default function StepDetails({
  service,
  date,
  slot,
  onSubmit,
  onBack,
  submitting,
}: {
  service: Service;
  date: string;
  slot: TimeSlot;
  onSubmit: (name: string, contact: string) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(name, contact);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-base min-h-[48px] flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ color: "var(--color-accent)" }}
      >
        ← Changer d&apos;horaire
      </button>

      {/* Summary */}
      <div
        className="rounded-xl p-4 border"
        style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
      >
        <p className="text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
          {service.name}
        </p>
        <p style={{ color: "var(--color-muted)" }}>
          {formatDate(date)} à {formatTime(slot.start)} — avec {slot.worker_name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="booking-name" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
            Votre nom
          </label>
          <input
            id="booking-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom et nom"
            className="w-full rounded-lg px-4 min-h-[48px] border text-base"
            style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
          />
        </div>
        <div>
          <label htmlFor="booking-contact" className="block text-base font-medium mb-2" style={{ color: "var(--color-foreground)" }}>
            Téléphone ou email
          </label>
          <input
            id="booking-contact"
            type="text"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Pour confirmer votre rendez-vous"
            className="w-full rounded-lg px-4 min-h-[48px] border text-base"
            style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-lg text-white text-lg font-semibold min-h-[56px] hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: "var(--color-accent)" }}
        >
          {submitting ? "Réservation en cours..." : "Confirmer le rendez-vous"}
        </button>
      </form>
    </div>
  );
}
