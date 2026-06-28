import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Membership from "@/components/Membership";
import Specials from "@/components/Specials";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Membership />
      <Specials />
      <Gallery />
      <Reviews />
      <Location />
      <CtaBand />
      <Footer />
    </>
  );
}