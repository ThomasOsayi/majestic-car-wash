const ITEMS = [
  "100% Hand Wash",
  "Silver $31.99 • Gold $36.99 • Diamond $41.99",
  "Thursday Special $27.99",
  "Complete Auto Detailing",
  "Shell Gas On-Site",
  "Mon–Sat 8AM–6PM · Sun 8AM–5PM",
  "One Block West of Fairfax",
  "Gift Certificates Available",
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {loop.map((item, i) => (
          <div className="marquee-item" key={i}>
            {item} <span className="sep" />
          </div>
        ))}
      </div>
    </div>
  );
}
