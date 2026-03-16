import RevealOnScroll from "./RevealOnScroll";

const images = [
  { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80", alt: "Clean car", className: "gc-wide" },
  { src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&q=80", alt: "Car shine" },
  { src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80", alt: "Sports car" },
  { src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80", alt: "BMW clean" },
  { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80", alt: "Luxury car", className: "gc-wide" },
  { src: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=500&q=80", alt: "Car wheel" },
];

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Gallery</div>
          <div className="section-title">
            See the Majestic
            <br />
            Difference
          </div>
        </RevealOnScroll>
        <div className="gallery-mosaic">
          {images.map((img, i) => (
            <RevealOnScroll
              className={`gallery-cell${img.className ? ` ${img.className}` : ""}`}
              delay={i * 80}
              key={img.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}