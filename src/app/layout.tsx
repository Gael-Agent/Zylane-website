import type { Metadata } from "next";
import { inter, playfair } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zylane Coiffeur Barbier | Le Mont-sur-Lausanne",
  description: "Salon de coiffure et barbier à Le Mont-sur-Lausanne. Coupes femmes, hommes, enfants et soins de barbe. Prenez rendez-vous en ligne.",
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
