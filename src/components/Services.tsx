const services = [
  {
    title: "Exterior Hand Wash",
    desc: "Full foam bath, hand mitt wash, chamois dry, tire & rim clean, and window wipe.",
    price: "From $20",
    img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=700&q=80",
  },
  {
    title: "Full-Service Wash",
    desc: "Exterior wash plus interior vacuum, dashboard wipe, door jams, and all interior windows.",
    price: "From $30",
    img: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=700&q=80",
  },
  {
    title: "Premium Detail",
    desc: "Clay bar, hand wax, leather conditioning, carpet shampoo, and engine bay cleaning.",
    price: "From $75",
    img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=700&q=80",
  },
  {
    title: "Paint Protection",
    desc: "Ceramic coating, paint sealant, and UV protection to keep your finish looking showroom-new.",
    price: "From $150",
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=80",
  },
  {
    title: "Interior Deep Clean",
    desc: "Full shampoo extraction, leather treatment, vent dusting, and odor elimination.",
    price: "From $60",
    img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=700&q=80",
  },
  {
    title: "Sap & Stain Removal",
    desc: "Tree sap, cement splatter, tar, overspray — if it's stuck to your car, we'll safely remove it.",
    price: "Custom Quote",
    img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=700&q=80",
  },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Services</div>
          <div className="section-title">
            From Quick Wash
            <br />
            to Full Detail
          </div>
          <p className="section-sub">
            Every wash is done by hand. Choose the level of care your vehicle
            needs — and leave the rest to us.
          </p>
        </div>
        <div className="services-grid">
          {services.map((svc) => (
            <div className="svc-card reveal" key={svc.title}>
              <div className="svc-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svc.img} alt={svc.title} />
              </div>
              <div className="svc-card-body">
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <div className="svc-price-tag">{svc.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}