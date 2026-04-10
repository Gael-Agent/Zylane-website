"use client";

import { useEffect, useState } from "react";
import { salonInfo, hours, isOpenNow } from "@/lib/data";

function OpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    setStatus(isOpenNow());
    const interval = setInterval(() => setStatus(isOpenNow()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${
        status.open
          ? "bg-green-500/10 text-green-500"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          status.open ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {status.label}
    </span>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28" style={{ background: "var(--color-bg-alt)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
          >
            Nous trouver
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
          <OpenStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-8">
            <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
              >
                Horaires d&apos;ouverture
              </h3>
              <ul className="space-y-3">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex justify-between items-center text-lg py-1"
                    style={{ color: h.closed ? "var(--color-muted)" : "var(--color-foreground)" }}
                  >
                    <span className="font-medium">{h.day}</span>
                    <span className={h.closed ? "italic" : "font-semibold"}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
              >
                Coordonnées
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: "var(--color-accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
                      {salonInfo.address.street}
                    </p>
                    <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
                      {salonInfo.address.zip} {salonInfo.address.city}
                    </p>
                  </div>
                </div>
                <a
                  href="tel:+41216523227"
                  className="flex items-center gap-3 text-lg transition-opacity hover:opacity-80 min-h-[48px]"
                  style={{ color: "var(--color-accent)" }}
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {salonInfo.phoneDisplay}
                </a>
                <a
                  href={salonInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg transition-opacity hover:opacity-80 min-h-[48px]"
                  style={{ color: "var(--color-accent)" }}
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  {salonInfo.instagramHandle}
                </a>
              </div>
            </div>

            <a
              href="tel:+41216523227"
              className="flex items-center justify-center gap-3 w-full py-5 text-white text-xl font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[64px]"
              style={{ background: "var(--color-accent)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Appelez-nous
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border h-[400px] lg:h-full lg:min-h-[500px]" style={{ borderColor: "var(--color-border)" }}>
            <iframe
              src={salonInfo.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zylane Coiffeur Barbier sur Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
