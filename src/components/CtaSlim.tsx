import Link from "next/link";

export default function CtaSlim({
  heading,
  text,
  href,
  btn,
}: {
  heading: string;
  text: string;
  href: string;
  btn: string;
}) {
  return (
    <section className="cta-slim">
      <div className="section-inner">
        <h2>{heading}</h2>
        <p>{text}</p>
        <Link href={href} className="btn btn-red">{btn}</Link>
      </div>
    </section>
  );
}
