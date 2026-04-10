"use client";

import { useEffect, useState } from "react";
import { salonInfo } from "@/lib/data";

function CalEmbed({ calLink }: { calLink: string }) {
  const [CalComponent, setCalComponent] = useState<React.ComponentType<{ calLink: string; style?: React.CSSProperties }> | null>(null);

  useEffect(() => {
    import("@calcom/embed-react").then((mod) => {
      setCalComponent(() => mod.default);
    });
  }, []);

  if (!CalComponent) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: "var(--color-muted)" }}>
        Chargement du calendrier...
      </div>
    );
  }

  return (
    <CalComponent
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll", minHeight: "500px" }}
    />
  );
}

export default function Booking() {
  const hasCalLink = salonInfo.calLink.length > 0;

  return (
    <section id="reserver" className="py-20 sm:py-28" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
          >
            Réserver un rendez-vous
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
          <p className="text-lg" style={{ color: "var(--color-muted)" }}>
            Choisissez le créneau qui vous convient
          </p>
        </div>

        {hasCalLink ? (
          <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "var(--color-border)" }}>
            <CalEmbed calLink={salonInfo.calLink} />
          </div>
        ) : (
          <div className="text-center rounded-2xl p-8 sm:p-12 border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
            <p className="text-xl mb-6" style={{ color: "var(--color-foreground)" }}>
              Pour prendre rendez-vous, appelez-nous directement :
            </p>
            <a
              href="tel:+41216523227"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 text-white text-xl font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[64px]"
              style={{ background: "var(--color-accent)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {salonInfo.phoneDisplay}
            </a>
            <p className="mt-6 text-base" style={{ color: "var(--color-muted)" }}>
              Vous pouvez aussi passer directement au salon pendant nos heures d&apos;ouverture.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
