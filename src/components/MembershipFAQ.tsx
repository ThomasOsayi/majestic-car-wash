"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const QA = [
  {
    q: "Is this an unlimited wash plan?",
    a: "No. Members pay a low monthly fee for member pricing, perks, and savings, and still pay less per wash. Club Plus includes 1 Full Service Wash each month and Club Elite includes 2.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no contracts. Cancel or change your tier whenever you like.",
  },
  {
    q: "Do my included washes carry over?",
    a: "Included monthly washes refresh at the start of each billing cycle and do not roll over.",
  },
  {
    q: "Does membership work on SUVs and trucks?",
    a: "Yes. Larger vehicles may carry the standard size upcharge on washes and detail services.",
  },
  {
    q: "Do members get a frequent wash card too?",
    a: "Frequent wash cards are available to every customer, member or not. Just ask the cashier on your next visit.",
  },
];

export default function MembershipFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ background: "var(--cream)" }}>
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Questions</div>
          <div className="section-title">Membership FAQ</div>
        </RevealOnScroll>
        <RevealOnScroll className="faq">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item${isOpen ? " open" : ""}`} key={i}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? null : i)}>
                  {item.q} <span className="chev">+</span>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? 240 : 0 }}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </RevealOnScroll>
      </div>
    </section>
  );
}
