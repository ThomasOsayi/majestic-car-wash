const items = [
  "100% Hand Wash",
  "Full Interior Detail",
  "Scratch-Free Guarantee",
  "Unlimited Memberships",
  "Shell Gas On-Site",
  "Beverly Grove, LA",
  "Open 7 Days a Week",
  "40+ Years of Trust",
];

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {[...items, ...items].map((text, i) => (
          <div className="marquee-item" key={i}>
            {text} <span className="sep"></span>
          </div>
        ))}
      </div>
    </div>
  );
}