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
