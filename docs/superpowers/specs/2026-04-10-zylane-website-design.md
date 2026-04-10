# Zylane Coiffeur Barbier — Website Design Spec

## Overview

Professional single-page website for Zylane Coiffeur Barbier, a hair salon and barbershop at Route du Grand-Mont 16, 1052 Le Mont-sur-Lausanne, Switzerland. Owner: Gülsen Coban Telli. Founded 2019.

**Primary goal**: Help clients find the salon, understand services/pricing, and book appointments easily — especially older clients who need simplicity.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Booking**: Cal.com free tier (embedded widget)
- **Deployment**: Vercel
- **Repository**: GitHub (public, under Gaellosada account)
- **Language**: French only

## Architecture

Single-page scrollable site with smooth anchor navigation. No client-side routing complexity — one `page.tsx` with section components.

```
src/
  app/
    layout.tsx          # Root layout, fonts, metadata, schema.org
    page.tsx            # Main page composing all sections
    globals.css         # Tailwind + CSS custom properties (themes)
  components/
    Header.tsx          # Fixed nav bar with anchor links
    Hero.tsx            # Full-width hero with CTA
    Services.tsx        # Price list by category
    Booking.tsx         # Cal.com embed
    Hours.tsx           # Opening hours display
    Contact.tsx         # Map, address, phone
    Footer.tsx          # Minimal footer
  lib/
    data.ts             # All salon data (hours, services, prices) in one file
    themes.ts           # Theme definitions
  public/
    images/             # Stock photos (replaceable by owner)
```

## Sections (top to bottom)

### 1. Header (fixed)
- Salon name "ZYLANE" left-aligned
- Nav links: Accueil, Services, Réserver, Contact
- Sticky on scroll, semi-transparent background
- Mobile: hamburger menu (simple slide-down, not a full overlay)
- **Accessibility**: Large tap targets (48px min), visible focus states

### 2. Hero
- Full-viewport-height section
- Background: high-quality barbershop stock photo with overlay
- Salon name + tagline ("Coiffeur & Barbier depuis 2019")
- Location: "Le Mont-sur-Lausanne"
- Two CTAs: "Réserver" (primary) and "Nos services" (secondary)
- **Accessibility**: Text always readable over image (solid overlay, not transparency tricks)

### 3. Services & Tarifs
- Four categories in a clean grid/list:
  - **Femmes**: Coupe, Brushing, Coloration, Mèches, Balayage
  - **Hommes**: Coupe, Coupe + barbe, Rasage classique
  - **Enfants**: Coupe enfant
  - **Barbe**: Taille de barbe, Rasage traditionnel
- Prices TBD (placeholder prices that owner updates in `data.ts`)
- **Accessibility**: Large text (18px+ body), high contrast, clear visual separation

### 4. Réserver (Booking)
- Embedded Cal.com widget
- Brief text above: "Prenez rendez-vous en ligne" with fallback phone number
- Cal.com handles: time selection, service selection, confirmation, reminders
- **Fallback**: If Cal.com not yet configured, show a prominent phone number + "Appelez-nous" CTA

### 5. Horaires & Contact
- Opening hours in a clear, large-font table:
  - Lundi: Fermé
  - Mardi: 8h30 – 18h30
  - Mercredi: 8h30 – 12h00
  - Jeudi: 8h30 – 18h30
  - Vendredi: 8h30 – 18h30
  - Samedi: 8h30 – 14h00
  - Dimanche: Fermé
- Address with Google Maps embed (interactive)
- Click-to-call phone button (large, obvious)
- Today's status indicator: "Ouvert maintenant" / "Fermé"

### 6. Footer
- Minimal: © 2019-2026 Zylane Coiffeur Barbier
- Address one-liner
- Phone link

## Theming

Two complete themes via CSS custom properties, switchable by a single config value in `data.ts`:

### Theme A — Elegant Dark
- Background: `#1a1a2e` → `#16213e` gradient
- Text: `#f0ead6` (warm white)
- Accent: `#c9a96e` (gold)
- Secondary: `#8a8a9a`
- Cards/sections: `rgba(255,255,255,0.05)` subtle glass
- Typography: Serif headings (Playfair Display), sans-serif body (Inter)

### Theme B — Warm Modern
- Background: `#faf7f2` (cream)
- Text: `#2c2c2c` (near-black)
- Accent: `#8b7355` (warm brown)
- Secondary: `#666`
- Cards/sections: white with subtle shadow
- Typography: Sans-serif throughout (Inter), light weight headings

## Accessibility (critical — older user base)

- **Font sizes**: Body 18px minimum, headings 24-48px
- **Tap targets**: 48px minimum on all interactive elements
- **Contrast**: WCAG AA minimum on both themes
- **Navigation**: Linear, predictable, no hidden content
- **No autoplay**: No videos, no carousels, no animations that distract
- **Phone CTA**: Always visible, large, obvious
- **Focus states**: Visible outlines on keyboard navigation
- **Reduced motion**: Respect `prefers-reduced-motion`

## Images

Stock photos from Unsplash (free license), stored in `public/images/`:
- Hero background: barbershop interior or barber at work
- Services section: 1-2 accent photos (scissors, styling)
- Stored locally (not hotlinked) for reliability

Owner can replace with real photos by swapping files — same filenames.

**Instagram**: @zylane_coiffure — owner can pull real photos from here. Link to Instagram in footer.

## SEO

- `<title>`: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne"
- `<meta description>`: French description with services and location
- Schema.org `LocalBusiness` + `HairSalon` structured data (JSON-LD)
- Open Graph tags for social sharing
- `robots.txt` and `sitemap.xml`

## Deployment Plan

1. Create GitHub repo `Zylane-website` under Gaellosada
2. Build and test locally
3. Create new Vercel account (fresh credentials for salon owner)
4. Connect repo → Vercel, deploy both theme variants as preview URLs
5. Owner picks theme → set as production
6. Custom domain can be added later by owner

## Out of Scope

- Gallery/portfolio page
- Blog
- Multi-language support
- Custom booking backend/database
- Online payment
- Asya Beauty integration

## Success Criteria

1. Site loads in <2s on mobile 3G
2. Lighthouse score >90 on all categories
3. Both themes fully functional and visually polished
4. Cal.com booking embed works (or graceful fallback)
5. All information accurate (hours, address, phone)
6. Deployed and accessible on Vercel
7. Owner can update prices by editing one data file
