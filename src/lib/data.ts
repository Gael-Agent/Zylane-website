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
  calLink: "",
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

export function isOpenNow(): { open: boolean; label: string } {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" })
  );
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  const schedule: Record<number, [number, number] | null> = {
    0: null,
    1: null,
    2: [510, 1110],
    3: [510, 720],
    4: [510, 1110],
    5: [510, 1110],
    6: [510, 840],
  };

  const todaySchedule = schedule[day];
  if (!todaySchedule) return { open: false, label: "Fermé aujourd'hui" };

  const [openTime, closeTime] = todaySchedule;
  if (time >= openTime && time < closeTime) return { open: true, label: "Ouvert maintenant" };
  if (time < openTime) return { open: false, label: `Ouvre à ${Math.floor(openTime / 60)}h${(openTime % 60).toString().padStart(2, "0")}` };
  return { open: false, label: "Fermé" };
}
