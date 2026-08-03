import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import CtaSlim from "@/components/CtaSlim";

export const metadata: Metadata = {
  title: "Wash & Detail Menu | Majestic Car Wash",
  description:
    "Silver, Gold and Diamond hand washes plus a full detail menu: super clean, hand & wax, interior shampoo, clay & wax, exterior detail, and complete packages.",
};

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <PageHero
        img="/majestic/wash-menu-sign.jpg"
        label="The Menu"
        title="Wash & Detail Menu"
        sub="Three hand-wash tiers and a full detail menu. Every package starts with a 100% hand wash. Larger vehicles may carry a size upcharge."
      />
      <Services />
      <CtaSlim
        heading="Wash more, pay less."
        text="Members get member pricing on every wash and detail, plus included washes on higher tiers. Plans start at $24.99/mo."
        href="/membership"
        btn="See Membership Tiers →"
      />
      <Footer />
    </>
  );
}
