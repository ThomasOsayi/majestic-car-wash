import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Membership from "@/components/Membership";
import HowItWorks from "@/components/HowItWorks";
import MembershipFAQ from "@/components/MembershipFAQ";
import CtaSlim from "@/components/CtaSlim";

export const metadata: Metadata = {
  title: "Membership | Majestic Car Wash",
  description:
    "Member pricing, perks, and real savings. Majestic Club from $19.99/mo, Club Plus, and Club Elite. Not unlimited. No contracts, cancel anytime.",
};

export default function MembershipPage() {
  return (
    <>
      <Navbar />
      <PageHero
        img="/majestic/detailing-bay.jpg"
        label="Membership"
        title="Join the Club."
        sub="Member pricing, perks, and real savings, built around loyalty, not unlimited access. No contracts, cancel anytime."
      />
      <Membership />
      <HowItWorks />
      <MembershipFAQ />
      <CtaSlim
        heading="Got a car that needs more than a wash?"
        text="Browse the full detail menu: clay & wax, interior shampoo, and complete int. & ext. packages."
        href="/menu"
        btn="See the Full Menu →"
      />
      <Footer />
    </>
  );
}
