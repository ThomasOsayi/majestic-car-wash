const ITEMS = [
  "100% Hand Wash",
  "Silver $29.99 • Gold $34.99 • Diamond $39.99",
  "Thursday Special $25.99",
  "Complete Auto Detailing",
  "Shell Gas On-Site",
  "Open 7 Days • 8AM to 5PM",
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
