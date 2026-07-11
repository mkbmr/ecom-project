import { Link } from "react-router-dom"

function MaisonAbout() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-text">
          <h5 className="about-established">Established 2026</h5>
          <h3 className="about-headline">Silhouettes of Absolute Intent.</h3>
        </div>
        <img className="about-hero-image" src="/About.jpg" alt="Italian Trulli" />
      </section>

      <section className="about-philosophy">
        <h3 className="about-subtitle">Our Philosophy</h3>
        <div className="about-divider" />
        <p className="about-text">
          At Maison Aura, a suit is never merely stitched; it is engineered.
          In our private atelier, every silhouette is honed through tradition and modern precision.
          We marry Savile Row discipline with fluid structure, selecting only the rarest fabrics and the subtlest lines.
          This is couture built to endure a quiet statement of purpose, elevated for a lifetime.
        </p>

        <Link to="/shop/all" className="btn-return">
          Return to the Collections
        </Link>
      </section>
    </div>
  )
}

export default MaisonAbout