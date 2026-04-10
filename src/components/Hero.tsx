import Image from "next/image";
import { salonInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/images/hero.jpg"
        alt="Intérieur du salon Zylane"
        fill
        className="object-cover"
        priority
        quality={80}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-sm sm:text-base tracking-[0.3em] text-gray-300 mb-4 uppercase">
          {salonInfo.address.city}
        </p>
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.15em] text-white mb-4"
          style={{ fontFamily: "var(--heading-font)" }}
        >
          {salonInfo.name.toUpperCase()}
        </h1>
        <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: "var(--color-accent)" }} />
        <p className="text-lg sm:text-xl text-gray-200 mb-10 tracking-wide">
          {salonInfo.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#reserver"
            className="inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity min-h-[56px]"
            style={{ background: "var(--color-accent)" }}
          >
            Réserver un rendez-vous
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white text-lg rounded-lg hover:bg-white/10 transition-colors min-h-[56px]"
          >
            Nos services
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
