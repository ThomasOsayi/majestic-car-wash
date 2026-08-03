import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Specials from "@/components/Specials";
import CtaSlim from "@/components/CtaSlim";

export const metadata: Metadata = {
  title: "Coupons & Specials | Majestic Car Wash",
  description:
    "Current coupons, weekly Thursday, senior, Uber/Lyft and student specials, wash books, rain checks, gift certificates, and Shell gas savings.",
};

export default function DealsPage() {
  return (
    <>
      <Navbar />
      <PageHero
        img="/majestic/storefront.jpg"
        label="Save More"
        title="Coupons & Specials"
        sub="Current offers, weekly specials, wash books, and ways to save every time you visit."
      />
      <Specials />
      <CtaSlim
        heading="Save on every single visit."
        text="Become a Majestic member for member pricing on every wash and detail. Plans start at $24.99/mo."
        href="/membership"
        btn="See Membership Tiers →"
      />
      <Footer />
    </>
  );
}
