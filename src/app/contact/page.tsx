import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "About & Contact | Majestic Car Wash",
  description:
    "Beverly Grove's hand car wash and complete auto detailing. 100% hand wash, personalized care, and Shell gas on-site. 8017 W 3rd St, open 7 days, 8AM to 5PM.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <PageHero
        img="/majestic/storefront.jpg"
        label="Our Story"
        title="About Majestic"
        sub="Beverly Grove's hand car wash and complete auto detailing. 100% hand wash, personalized care, and Shell gas on-site."
      />
      <About />
      <Reviews />
      <Location />
      <ContactForm />
      <Footer />
    </>
  );
}
