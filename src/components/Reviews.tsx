/* ── Customer reviews ──────────────────────────────────────────────────
   Continuous one-direction marquee of short verbatim pull-quotes (the
   reviewer's own exact words), each linking to the full review on Yelp.
   The list is rendered twice so the scroll loops seamlessly with no gap.

   All four are clean, on-message 5-star raves. Aaron Z. and Carissa M. are
   left off on purpose (their text mentions paint/equipment damage and "not
   personalized service," which fight the hand-wash positioning).

   To swap a quote, keep it to a short exact phrase from that person's review
   (don't reword it). To add one, copy an entry in REVIEWS.
   --------------------------------------------------------------------- */
   const YELP = "https://www.yelp.com/biz/majestic-car-wash-los-angeles";

   const REVIEWS = [
     { initial: "S", name: "S S.",      source: "Yelp \u00b7 April 2026",   color: "var(--red)",  quote: "My car looked brand new.",            href: YELP },
     { initial: "E", name: "Emily L.",  source: "Yelp \u00b7 January 2024", color: "var(--blue)", quote: "They have a customer for life.",       href: YELP },
     { initial: "A", name: "Angel P.",  source: "Yelp \u00b7 July 2023",    color: "var(--gold)", quote: "Javier and his team made it work.",    href: YELP },
     { initial: "N", name: "Nycole H.", source: "Yelp \u00b7 August 2020",  color: "var(--red)",  quote: "Love a nice sparkly car at the end.",  href: YELP },
   ];
   
   export default function Reviews() {
     // Render the set twice for a seamless looping marquee
     const loop = [...REVIEWS, ...REVIEWS];
   
     return (
       <section className="reviews-section" id="reviews">
         <div className="section-inner">
           <div className="section-label">Reviews</div>
           <div className="section-title">What Drivers<br />Say.</div>
           <p className="section-sub">Real 5-star reviews from drivers across Beverly Grove.</p>
         </div>
   
         <div className="rev-marquee" aria-label="Customer reviews">
           <div className="rev-marquee-track">
             {loop.map((r, i) => (
               <div className="rev-card" key={`${r.name}-${i}`} aria-hidden={i >= REVIEWS.length}>
                 <div className="rev-stars">★★★★★</div>
                 <p className="rev-text">&ldquo;{r.quote}&rdquo;</p>
                 <div className="rev-card-foot">
                   <div className="rev-author">
                     <div className="rev-avatar-letter" style={{ background: r.color }}>{r.initial}</div>
                     <div>
                       <div className="rev-name">{r.name}</div>
                       <div className="rev-source">{r.source}</div>
                     </div>
                   </div>
                   <a className="rev-readmore" href={r.href} target="_blank" rel="noopener noreferrer">
                     Read full review on Yelp &rarr;
                   </a>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   }