import type { ReactNode } from "react";

export default function PageHero({
  img,
  label,
  title,
  sub,
}: {
  img: string;
  label: string;
  title: ReactNode;
  sub: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">
        <img src={img} alt="" />
      </div>
      <div className="section-inner">
        <div className="section-label">{label}</div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
    </section>
  );
}
