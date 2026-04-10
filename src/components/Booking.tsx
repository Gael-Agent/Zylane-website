"use client";

import { useState, useEffect } from "react";
import { getServices, createBooking } from "@/lib/booking-actions";
import type { Service, TimeSlot } from "@/lib/types";
import StepService from "@/components/booking/StepService";
import StepDateTime from "@/components/booking/StepDateTime";
import StepDetails from "@/components/booking/StepDetails";
import StepConfirm from "@/components/booking/StepConfirm";

type Step = "service" | "datetime" | "details" | "confirm";

export default function Booking() {
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selected values
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  function reset() {
    setStep("service");
    setSelectedService(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setError("");
  }

  async function handleBooking(clientName: string, clientContact: string) {
    if (!selectedService || !selectedSlot || !selectedDate) return;
    setSubmitting(true);
    setError("");

    const result = await createBooking({
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      workerId: selectedSlot.worker_id,
      clientName,
      clientContact,
    });

    setSubmitting(false);
    if (result.success) {
      setStep("confirm");
    } else {
      setError(result.error || "Erreur inconnue");
    }
  }

  const stepLabels: Record<Step, string> = {
    service: "1. Service",
    datetime: "2. Date & heure",
    details: "3. Vos coordonnées",
    confirm: "✓ Confirmé",
  };

  const steps: Step[] = ["service", "datetime", "details", "confirm"];
  const currentIdx = steps.indexOf(step);

  return (
    <section id="reserver" className="py-20 sm:py-28" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
          >
            Prendre rendez-vous
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
        </div>

        {/* Progress indicator */}
        {step !== "confirm" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: i <= currentIdx ? "var(--color-accent)" : "var(--color-border)",
                    color: i <= currentIdx ? "white" : "var(--color-muted)",
                  }}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className="w-8 h-[2px]"
                    style={{ background: i < currentIdx ? "var(--color-accent)" : "var(--color-border)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}
        >
          {loading && (
            <p className="text-center py-8" style={{ color: "var(--color-muted)" }}>
              Chargement des services...
            </p>
          )}

          {!loading && services.length === 0 && (
            <p className="text-center py-8" style={{ color: "var(--color-muted)" }}>
              Le système de réservation sera bientôt disponible. En attendant, passez directement au salon.
            </p>
          )}

          {!loading && services.length > 0 && (
            <>
              {step === "service" && (
                <StepService
                  services={services}
                  onSelect={(s) => {
                    setSelectedService(s);
                    setStep("datetime");
                  }}
                />
              )}

              {step === "datetime" && selectedService && (
                <StepDateTime
                  service={selectedService}
                  onSelect={(date, slot) => {
                    setSelectedDate(date);
                    setSelectedSlot(slot);
                    setStep("details");
                  }}
                  onBack={() => setStep("service")}
                />
              )}

              {step === "details" && selectedService && selectedSlot && (
                <StepDetails
                  service={selectedService}
                  date={selectedDate}
                  slot={selectedSlot}
                  onSubmit={handleBooking}
                  onBack={() => setStep("datetime")}
                  submitting={submitting}
                />
              )}

              {step === "confirm" && <StepConfirm onReset={reset} />}

              {error && (
                <p className="text-center mt-4 text-red-400 text-base">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
