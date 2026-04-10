# Zylane Coiffeur Barbier Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a professional single-page website for Zylane Coiffeur Barbier with two theme variants, Cal.com booking integration, and accessibility-first design for older users.

**Architecture:** Next.js 14 App Router, single page with section components, CSS custom properties for dual theming (dark elegant / warm modern), data-driven content from a single config file. Deployed on Vercel from GitHub.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, @calcom/embed-react, next/font (Inter + Playfair Display), Vercel

**Spec:** `docs/superpowers/specs/2026-04-10-zylane-website-design.md`

---

## File Structure

```
src/
  app/
    layout.tsx          # Root layout: fonts, metadata, schema.org JSON-LD, theme class
    page.tsx            # Composes all section components
    globals.css         # Tailwind directives + CSS custom properties for both themes
    fonts.ts            # Font definitions (Inter + Playfair Display)
  components/
    Header.tsx          # Fixed nav with anchor links + mobile hamburger
    Hero.tsx            # Full-viewport hero with photo overlay + CTAs
    Services.tsx        # Services & price list by category
    Booking.tsx         # Cal.com embed with phone fallback
    Contact.tsx         # Hours table + Google Maps + phone + open/closed status
    Footer.tsx          # Minimal footer with Instagram link
  lib/
    data.ts             # All salon data: info, hours, services/prices, social links
public/
  images/
    hero.jpg            # Barbershop stock photo (hero background)
    services.jpg        # Styling/scissors stock photo (services accent)
    favicon.ico         # Simple Z favicon
next.config.ts          # Next.js config
tailwind.config.ts      # Tailwind config with theme extensions
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: entire project via create-next-app
- Modify: `package.json`, `tailwind.config.ts`, `next.config.ts`
- Create: `.gitignore`, `src/app/fonts.ts`

- [ ] **Step 1: Create Next.js project**

```bash
cd /home/gael/claude_workspace/Zylane-website
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir=false --import-alias="@/*" --use-npm
```

Accept defaults. This creates the project with TypeScript, Tailwind, App Router, ESLint.

- [ ] **Step 2: Clean up default boilerplate**

Delete default content from `src/app/page.tsx` — replace with minimal placeholder:

```tsx
export default function Home() {
  return <main>Zylane — coming soon</main>;
}
```

Delete default styles from `src/app/globals.css` except the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Set up fonts**

Create `src/app/fonts.ts`:

```ts
import { Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});
```

Update `src/app/layout.tsx` to use both fonts:

```tsx
import type { Metadata } from "next";
import { inter, playfair } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne",
  description:
    "Salon de coiffure et barbier à Le Mont-sur-Lausanne. Coupes femmes, hommes, enfants et soins de barbe. Prenez rendez-vous en ligne.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Configure Tailwind for theming**

Update `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        accent: "var(--color-accent)",
        secondary: "var(--color-secondary)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
      },
      fontSize: {
        "body": ["1.125rem", { lineHeight: "1.75rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Install Cal.com embed**

```bash
npm install @calcom/embed-react
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Verify http://localhost:3000 shows "Zylane — coming soon".

- [ ] **Step 7: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind, fonts, and theming config"
```

---

### Task 2: Data Layer & Theming CSS

**Files:**
- Create: `src/lib/data.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create data file**

Create `src/lib/data.ts` — single source of truth for all salon content:

```ts
export const THEME = "dark" as "dark" | "light";

export const salonInfo = {
  name: "Zylane",
  fullName: "Zylane Coiffeur Barbier",
  tagline: "Coiffeur & Barbier depuis 2019",
  address: {
    street: "Route du Grand-Mont 16",
    zip: "1052",
    city: "Le Mont-sur-Lausanne",
    canton: "Vaud",
    country: "Suisse",
  },
  phone: "+41 21 652 32 27",
  phoneDisplay: "021 652 32 27",
  email: "",
  instagram: "https://www.instagram.com/zylane_coiffure/",
  instagramHandle: "@zylane_coiffure",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.8!2d6.6277!3d46.5558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2e3e1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sRoute%20du%20Grand-Mont%2016%2C%201052%20Le%20Mont-sur-Lausanne!5e0!3m2!1sfr!2sch!4v1700000000000!5m2!1sfr!2sch",
  calLink: "", // Owner sets this after creating Cal.com account
};

export const hours = [
  { day: "Lundi", time: "Fermé", closed: true },
  { day: "Mardi", time: "8h30 – 18h30", closed: false },
  { day: "Mercredi", time: "8h30 – 12h00", closed: false },
  { day: "Jeudi", time: "8h30 – 18h30", closed: false },
  { day: "Vendredi", time: "8h30 – 18h30", closed: false },
  { day: "Samedi", time: "8h30 – 14h00", closed: false },
  { day: "Dimanche", time: "Fermé", closed: true },
];

export type ServiceCategory = {
  title: string;
  icon: string;
  services: { name: string; price: string }[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Femmes",
    icon: "✂️",
    services: [
      { name: "Coupe", price: "Dès CHF 45" },
      { name: "Brushing", price: "Dès CHF 35" },
      { name: "Coloration", price: "Dès CHF 65" },
      { name: "Mèches / Balayage", price: "Dès CHF 80" },
      { name: "Coupe + Brushing", price: "Dès CHF 70" },
    ],
  },
  {
    title: "Hommes",
    icon: "💈",
    services: [
      { name: "Coupe", price: "Dès CHF 30" },
      { name: "Coupe + Barbe", price: "Dès CHF 40" },
      { name: "Rasage classique", price: "Dès CHF 25" },
    ],
  },
  {
    title: "Enfants",
    icon: "👦",
    services: [
      { name: "Coupe enfant (0-12 ans)", price: "Dès CHF 20" },
    ],
  },
  {
    title: "Barbe",
    icon: "🪒",
    services: [
      { name: "Taille de barbe", price: "Dès CHF 15" },
      { name: "Rasage traditionnel", price: "Dès CHF 25" },
      { name: "Soin barbe complet", price: "Dès CHF 35" },
    ],
  },
];

/** Returns true if the salon is currently open based on Swiss time */
export function isOpenNow(): { open: boolean; label: string } {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" })
  );
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  const schedule: Record<number, [number, number] | null> = {
    0: null, // Dimanche
    1: null, // Lundi
    2: [510, 1110], // Mardi 8:30-18:30
    3: [510, 720], // Mercredi 8:30-12:00
    4: [510, 1110], // Jeudi 8:30-18:30
    5: [510, 1110], // Vendredi 8:30-18:30
    6: [510, 840], // Samedi 8:30-14:00
  };

  const todaySchedule = schedule[day];
  if (!todaySchedule) return { open: false, label: "Fermé aujourd'hui" };

  const [open, close] = todaySchedule;
  if (time >= open && time < close) return { open: true, label: "Ouvert maintenant" };
  if (time < open) return { open: false, label: `Ouvre à ${Math.floor(open / 60)}h${(open % 60).toString().padStart(2, "0")}` };
  return { open: false, label: "Fermé" };
}
```

- [ ] **Step 2: Write theme CSS variables**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Theme A — Elegant Dark */
  .theme-dark {
    --color-primary: #1a1a2e;
    --color-primary-hover: #16213e;
    --color-accent: #c9a96e;
    --color-secondary: #8a8a9a;
    --color-surface: rgba(255, 255, 255, 0.05);
    --color-surface-hover: rgba(255, 255, 255, 0.1);
    --color-foreground: #f0ead6;
    --color-muted: #a0a0b0;
    --color-bg: #1a1a2e;
    --color-bg-alt: #16213e;
    --color-border: rgba(201, 169, 110, 0.2);
    --color-card-bg: rgba(255, 255, 255, 0.03);
    --heading-font: var(--font-playfair), Georgia, serif;
    --gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  }

  /* Theme B — Warm Modern */
  .theme-light {
    --color-primary: #faf7f2;
    --color-primary-hover: #f5ede3;
    --color-accent: #8b7355;
    --color-secondary: #666666;
    --color-surface: #ffffff;
    --color-surface-hover: #f5ede3;
    --color-foreground: #2c2c2c;
    --color-muted: #888888;
    --color-bg: #faf7f2;
    --color-bg-alt: #f5ede3;
    --color-border: rgba(139, 115, 85, 0.2);
    --color-card-bg: #ffffff;
    --heading-font: var(--font-inter), system-ui, sans-serif;
    --gradient: linear-gradient(135deg, #faf7f2 0%, #f5ede3 100%);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--color-bg);
    color: var(--color-foreground);
    font-size: 1.125rem;
    line-height: 1.75;
  }

  h1, h2, h3, h4 {
    font-family: var(--heading-font);
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Focus states for accessibility */
  *:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts src/app/globals.css
git commit -m "feat: add salon data layer and dual-theme CSS variables"
```

---

### Task 3: Header Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Build Header**

Create `src/components/Header.tsx`:

```tsx
"use client";

import { useState } from "react";
import { salonInfo } from "@/lib/data";

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Réserver", href: "#reserver" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#accueil"
            className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-[var(--color-accent)]"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            {salonInfo.name.toUpperCase()}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors min-h-[48px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+41216523227"
              className="text-base font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity min-h-[48px] flex items-center"
            >
              📞 {salonInfo.phoneDisplay}
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden min-h-[48px] min-w-[48px] flex items-center justify-center text-[var(--color-foreground)]"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-6 border-t border-[var(--color-border)]" aria-label="Navigation mobile">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg py-3 px-4 rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] min-h-[48px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+41216523227"
                className="text-lg py-3 px-4 rounded-lg font-medium text-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] min-h-[48px] flex items-center"
              >
                📞 Appeler: {salonInfo.phoneDisplay}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add responsive header with mobile menu"
```

---

### Task 4: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`
- Add: `public/images/hero.jpg` (download stock photo)

- [ ] **Step 1: Download hero stock photo**

```bash
curl -L "https://images.unsplash.com/photo-1585747860019-8e57a5e3a45c?w=1920&q=80" -o public/images/hero.jpg
```

This is a barbershop interior photo. If the URL is unavailable, use any professional barbershop photo from Unsplash.

- [ ] **Step 2: Build Hero component**

Create `src/components/Hero.tsx`:

```tsx
import Image from "next/image";
import { salonInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt="Intérieur du salon Zylane"
        fill
        className="object-cover"
        priority
        quality={80}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
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

        <div className="w-16 h-[2px] bg-[var(--color-accent)] mx-auto mb-4" />

        <p className="text-lg sm:text-xl text-gray-200 mb-10 tracking-wide">
          {salonInfo.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#reserver"
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity min-h-[56px]"
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx public/images/hero.jpg
git commit -m "feat: add hero section with background image and CTAs"
```

---

### Task 5: Services Section

**Files:**
- Create: `src/components/Services.tsx`

- [ ] **Step 1: Build Services component**

Create `src/components/Services.tsx`:

```tsx
import { serviceCategories } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-[var(--color-bg-alt)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            Nos Services
          </h2>
          <div className="w-16 h-[2px] bg-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-[var(--color-muted)] text-lg">
            Des soins professionnels pour toute la famille
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {serviceCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl p-6 sm:p-8 bg-[var(--color-card-bg)] border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {category.icon}
                </span>
                <h3
                  className="text-2xl font-bold text-[var(--color-foreground)]"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  {category.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {category.services.map((service) => (
                  <li
                    key={service.name}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-[var(--color-foreground)] text-lg">
                      {service.name}
                    </span>
                    <span className="flex-shrink-0 border-b border-dotted border-[var(--color-border)] flex-grow mx-2" />
                    <span className="text-[var(--color-accent)] font-semibold text-lg whitespace-nowrap">
                      {service.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-[var(--color-muted)] mt-10 text-base">
          * Les prix indiqués sont des prix de base. Le tarif exact peut varier selon la prestation.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Services.tsx
git commit -m "feat: add services and pricing section"
```

---

### Task 6: Booking Section

**Files:**
- Create: `src/components/Booking.tsx`

- [ ] **Step 1: Build Booking component with Cal.com embed + fallback**

Create `src/components/Booking.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { salonInfo } from "@/lib/data";

function CalEmbed({ calLink }: { calLink: string }) {
  const [CalComponent, setCalComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@calcom/embed-react").then((mod) => {
      setCalComponent(() => mod.default);
    });
  }, []);

  if (!CalComponent) {
    return (
      <div className="flex items-center justify-center h-96 text-[var(--color-muted)]">
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
    <section id="reserver" className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            Réserver un rendez-vous
          </h2>
          <div className="w-16 h-[2px] bg-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-[var(--color-muted)] text-lg">
            Choisissez le créneau qui vous convient
          </p>
        </div>

        {hasCalLink ? (
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white">
            <CalEmbed calLink={salonInfo.calLink} />
          </div>
        ) : (
          /* Fallback when Cal.com is not configured */
          <div className="text-center rounded-2xl p-8 sm:p-12 bg-[var(--color-card-bg)] border border-[var(--color-border)]">
            <p className="text-xl text-[var(--color-foreground)] mb-6">
              Pour prendre rendez-vous, appelez-nous directement :
            </p>
            <a
              href="tel:+41216523227"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-white text-xl font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[64px]"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {salonInfo.phoneDisplay}
            </a>
            <p className="text-[var(--color-muted)] mt-6 text-base">
              Vous pouvez aussi passer directement au salon pendant nos heures d&apos;ouverture.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Booking.tsx
git commit -m "feat: add booking section with Cal.com embed and phone fallback"
```

---

### Task 7: Contact Section (Hours + Map + Phone + Open Status)

**Files:**
- Create: `src/components/Contact.tsx`

- [ ] **Step 1: Build Contact component**

Create `src/components/Contact.tsx`:

```tsx
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
    <section id="contact" className="py-20 sm:py-28 bg-[var(--color-bg-alt)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            Nous trouver
          </h2>
          <div className="w-16 h-[2px] bg-[var(--color-accent)] mx-auto mb-4" />
          <OpenStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Left: Hours + Info */}
          <div className="space-y-8">
            {/* Opening hours */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[var(--color-card-bg)] border border-[var(--color-border)]">
              <h3
                className="text-2xl font-bold mb-6 text-[var(--color-foreground)]"
                style={{ fontFamily: "var(--heading-font)" }}
              >
                Horaires d&apos;ouverture
              </h3>
              <ul className="space-y-3">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className={`flex justify-between items-center text-lg py-1 ${
                      h.closed ? "text-[var(--color-muted)]" : "text-[var(--color-foreground)]"
                    }`}
                  >
                    <span className="font-medium">{h.day}</span>
                    <span className={h.closed ? "italic" : "font-semibold"}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[var(--color-card-bg)] border border-[var(--color-border)]">
              <h3
                className="text-2xl font-bold mb-6 text-[var(--color-foreground)]"
                style={{ fontFamily: "var(--heading-font)" }}
              >
                Coordonnées
              </h3>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[var(--color-accent)] mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-lg text-[var(--color-foreground)]">
                      {salonInfo.address.street}
                    </p>
                    <p className="text-lg text-[var(--color-foreground)]">
                      {salonInfo.address.zip} {salonInfo.address.city}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href="tel:+41216523227"
                  className="flex items-center gap-3 text-lg text-[var(--color-accent)] hover:opacity-80 transition-opacity min-h-[48px]"
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {salonInfo.phoneDisplay}
                </a>

                {/* Instagram */}
                <a
                  href={salonInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg text-[var(--color-accent)] hover:opacity-80 transition-opacity min-h-[48px]"
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  {salonInfo.instagramHandle}
                </a>
              </div>
            </div>

            {/* Big call button */}
            <a
              href="tel:+41216523227"
              className="flex items-center justify-center gap-3 w-full py-5 bg-[var(--color-accent)] text-white text-xl font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[64px]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Appelez-nous
            </a>
          </div>

          {/* Right: Google Maps */}
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] h-[400px] lg:h-full lg:min-h-[500px]">
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: add contact section with hours, map, and open status"
```

---

### Task 8: Footer

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Build Footer**

Create `src/components/Footer.tsx`:

```tsx
import { salonInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-[var(--color-muted)]">
          <p>
            &copy; 2019–{new Date().getFullYear()} {salonInfo.fullName}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={salonInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent)] transition-colors min-h-[48px] flex items-center"
            >
              Instagram
            </a>
            <a
              href="tel:+41216523227"
              className="hover:text-[var(--color-accent)] transition-colors min-h-[48px] flex items-center"
            >
              {salonInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add footer with social and phone links"
```

---

### Task 9: Assemble Page + Layout (SEO + Schema.org)

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Compose all sections in page.tsx**

Replace `src/app/page.tsx`:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Add theme class + Schema.org JSON-LD to layout**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { inter, playfair } from "./fonts";
import { THEME, salonInfo } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne",
  description:
    "Salon de coiffure et barbier à Le Mont-sur-Lausanne. Coupes femmes, hommes, enfants et soins de barbe. Prenez rendez-vous en ligne.",
  keywords: [
    "coiffeur",
    "barbier",
    "Le Mont-sur-Lausanne",
    "salon de coiffure",
    "coupe homme",
    "coupe femme",
    "barbe",
    "Lausanne",
    "Vaud",
  ],
  openGraph: {
    title: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne",
    description:
      "Coiffeur & Barbier depuis 2019. Coupes femmes, hommes, enfants et soins de barbe à Le Mont-sur-Lausanne.",
    type: "website",
    locale: "fr_CH",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: salonInfo.fullName,
  image: "/images/hero.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: salonInfo.address.street,
    addressLocality: salonInfo.address.city,
    postalCode: salonInfo.address.zip,
    addressRegion: salonInfo.address.canton,
    addressCountry: "CH",
  },
  telephone: salonInfo.phone,
  url: "", // Set after deployment
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "08:30", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "08:30", closes: "12:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "08:30", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:30", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:30", closes: "14:00" },
  ],
  sameAs: [salonInfo.instagram],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeClass = THEME === "dark" ? "theme-dark" : "theme-light";

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} ${themeClass} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify dev server renders correctly**

```bash
npm run dev
```

Check http://localhost:3000 — the full page should render with all sections in the dark theme.

- [ ] **Step 4: Switch theme and verify**

In `src/lib/data.ts`, change `THEME` to `"light"` and verify the warm modern theme renders correctly. Then switch back to `"dark"`.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: assemble page with all sections, add SEO and Schema.org"
```

---

### Task 10: Visual Polish & Responsive Testing

**Files:**
- Possibly modify: any component for spacing/sizing fixes

- [ ] **Step 1: Test mobile responsiveness**

Open Chrome DevTools → Toggle device toolbar. Check at these breakpoints:
- iPhone SE (375px)
- iPhone 14 (390px)
- iPad (768px)
- Desktop (1280px)

Verify:
- All text readable without horizontal scroll
- Tap targets are 48px+ on mobile
- Mobile menu works
- No overflow issues
- Phone button prominent on all sizes

- [ ] **Step 2: Test both themes**

Toggle `THEME` between `"dark"` and `"light"` in `data.ts`. Verify each theme:
- Text contrast is sufficient (no light-on-light or dark-on-dark)
- All sections styled correctly
- Hero overlay works with both themes
- Cards, borders, and backgrounds look intentional

- [ ] **Step 3: Fix any issues found and commit**

```bash
git add -A
git commit -m "fix: responsive and theme polish"
```

---

### Task 11: GitHub Repository + Vercel Deployment

**Files:**
- Modify: `.gitignore` (add `.superpowers/`)

- [ ] **Step 1: Update .gitignore**

Add `.superpowers/` to `.gitignore` to exclude brainstorm files.

- [ ] **Step 2: Create GitHub repo**

```bash
gh repo create Zylane-website --public --source=. --remote=origin --push --description "Professional website for Zylane Coiffeur Barbier — Le Mont-sur-Lausanne"
```

- [ ] **Step 3: Deploy to Vercel**

The user will create Vercel credentials for the salon owner. Once credentials are available:

```bash
npm i -g vercel
vercel login  # User logs in with new credentials
vercel --yes  # Deploy with defaults
vercel --prod # Promote to production
```

Alternatively, connect via Vercel dashboard: Import GitHub repo → auto-deploy.

- [ ] **Step 4: Deploy second theme variant**

Create a branch with the alternate theme:

```bash
git checkout -b theme-light
```

In `src/lib/data.ts`, change `THEME` to `"light"`. Commit and push:

```bash
git add src/lib/data.ts
git commit -m "feat: switch to warm modern theme variant"
git push -u origin theme-light
```

Vercel auto-deploys preview for the branch. Both theme URLs available for owner to compare.

- [ ] **Step 5: Verify deployments**

Check both URLs work, all sections render, phone links work, maps load.

---

### Task 12: Final Google Maps Embed Fix

**Files:**
- Modify: `src/lib/data.ts`

- [ ] **Step 1: Get correct Google Maps embed URL**

Go to Google Maps → search "Zylane Coiffeur Barbier Le Mont-sur-Lausanne" → Share → Embed → Copy the iframe `src` URL. Update `salonInfo.googleMapsEmbed` in `data.ts` with the exact URL.

- [ ] **Step 2: Commit**

```bash
git add src/lib/data.ts
git commit -m "fix: correct Google Maps embed URL"
```

---

## Deployment Checklist

- [ ] Site loads on Vercel production URL
- [ ] Both theme variants accessible (main branch = dark, theme-light branch = light)
- [ ] Phone link works (click-to-call)
- [ ] Google Maps loads and shows correct location
- [ ] Instagram link opens @zylane_coiffure
- [ ] Booking section shows phone fallback (Cal.com configured later by owner)
- [ ] Mobile responsive at all breakpoints
- [ ] Open/closed status shows correctly
- [ ] All text in French, no English leaks
