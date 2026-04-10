"use client";

import { useState, useEffect } from "react";
import { getAvailableSlots } from "@/lib/booking-actions";
import type { Service, TimeSlot } from "@/lib/types";

export default function StepDateTime({
  service,
  onSelect,
  onBack,
}: {
  service: Service;
  onSelect: (date: string, slot: TimeSlot) => void;
  onBack: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [noSlots, setNoSlots] = useState(false);

  // Next 14 available days (skip Sunday=0, Monday=1)
  const availableDates: string[] = [];
  const today = new Date();
  for (let i = 1; availableDates.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 1) {
      availableDates.push(d.toISOString().split("T")[0]);
    }
  }

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setNoSlots(false);
    getAvailableSlots(service.id, selectedDate).then((result) => {
      setSlots(result);
      setNoSlots(result.length === 0);
      setLoading(false);
    });
  }, [selectedDate, service.id]);

  function formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.toLocaleDateString("fr-CH", { weekday: "short" });
    const num = d.getDate();
    const month = d.toLocaleDateString("fr-CH", { month: "short" });
    return `${day} ${num} ${month}`;
  }

  function formatTime(time: string): string {
    return time.substring(0, 5).replace(":", "h");
  }

  // Deduplicate: show each time once (pick first available worker)
  const uniqueSlots: TimeSlot[] = [];
  const seen = new Set<string>();
  for (const slot of slots) {
    if (!seen.has(slot.start)) {
      seen.add(slot.start);
      uniqueSlots.push(slot);
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-base min-h-[48px] flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ color: "var(--color-accent)" }}
      >
        ← Changer de service
      </button>

      <p className="text-lg" style={{ color: "var(--color-muted)" }}>
        <strong style={{ color: "var(--color-foreground)" }}>{service.name}</strong> — choisissez une date
      </p>

      {/* Date pills */}
      <div className="flex flex-wrap gap-2">
        {availableDates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className="px-4 py-2 rounded-lg border text-sm font-medium min-h-[44px] transition-colors"
            style={{
              background: selectedDate === date ? "var(--color-accent)" : "var(--color-bg)",
              color: selectedDate === date ? "white" : "var(--color-foreground)",
              borderColor: selectedDate === date ? "var(--color-accent)" : "var(--color-border)",
            }}
          >
            {formatDateLabel(date)}
          </button>
        ))}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-lg mb-3" style={{ color: "var(--color-muted)" }}>
            Créneaux disponibles :
          </p>
          {loading && (
            <p style={{ color: "var(--color-muted)" }}>Chargement...</p>
          )}
          {noSlots && !loading && (
            <p style={{ color: "var(--color-muted)" }}>
              Aucun créneau disponible ce jour. Essayez une autre date.
            </p>
          )}
          {!loading && uniqueSlots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {uniqueSlots.map((slot) => (
                <button
                  key={`${slot.start}-${slot.worker_id}`}
                  onClick={() => onSelect(selectedDate, slot)}
                  className="px-3 py-3 rounded-lg border text-center text-base font-medium min-h-[48px] transition-colors"
                  style={{
                    background: "var(--color-bg)",
                    color: "var(--color-foreground)",
                    borderColor: "var(--color-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                    e.currentTarget.style.color = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-foreground)";
                  }}
                >
                  {formatTime(slot.start)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
