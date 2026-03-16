const reviews = [
  {
    text: "I've been coming here for 3 years and the quality never drops. Ask for Javier — he treats your car like it's his own. Worth every single penny over the automated places.",
    name: "Michael R.",
    source: "Google Review",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    text: "Tree sap all over my hood from parking under a pine. Took it to Majestic and it came back looking brand new. No scratches, no swirls. These guys genuinely know what they're doing.",
    name: "Sarah K.",
    source: "Google Review",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    text: "My car comes out looking like it just rolled off the lot. They clean the inside too — vacuum, dash, windows. Things you never get at those drive-through tunnel places.",
    name: "David L.",
    source: "Google Review",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
];

export default function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Customer Love</div>
          <div className="section-title">
            Don&apos;t Take Our
            <br />
            Word For It
          </div>
          <p className="section-sub">
            Hear from customers who keep coming back, year after year.
          </p>
        </div>
        <div className="reviews-grid">
          {reviews.map((rev) => (
            <div className="rev-card reveal" key={rev.name}>
              <div className="rev-stars">★★★★★</div>
              <p className="rev-text">&ldquo;{rev.text}&rdquo;</p>
              <div className="rev-author">
                <div className="rev-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rev.avatar} alt="" />
                </div>
                <div>
                  <div className="rev-name">{rev.name}</div>
                  <div className="rev-source">{rev.source}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}