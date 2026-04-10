import type { Metadata } from "next";
import { inter, playfair } from "./fonts";
import { THEME, salonInfo } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne",
  description:
    "Salon de coiffure et barbier à Le Mont-sur-Lausanne. Coupes femmes, hommes, enfants et soins de barbe. Prenez rendez-vous en ligne.",
  keywords: [
    "coiffeur", "barbier", "Le Mont-sur-Lausanne", "salon de coiffure",
    "coupe homme", "coupe femme", "barbe", "Lausanne", "Vaud",
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
  url: "",
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
