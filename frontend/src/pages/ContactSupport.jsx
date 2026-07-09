import { Link } from "react-router-dom"

function ContactSupport() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h5 className="contact-eyebrow">Concierge Support</h5>
        <h3 className="contact-headline">Contact Support</h3>
        <Link to="/shop/all" className="btn-return">
          ← Return to Collections
        </Link>
      </section>

      <section className="contact-intro">
        <p className="contact-text">
          For personalised assistance, send your enquiry directly to our concierge support team.
        </p>
        <p className="contact-text">
          We typically respond within one business hour.
        </p>
      </section>

      <section className="contact-channels">
        <div className="contact-channel">
          <h5 className="contact-channel-title">Email Concierge</h5>
          <p className="contact-text">
            For order support, styling guidance, and atelier consultations.
          </p>
          <a className="contact-email" href="mailto:support@maisonaura.com">
            support@maisonaura.com
          </a>
        </div>

        <div className="contact-channel">
          <h5 className="contact-channel-title">General Enquiries</h5>
          <p className="contact-text">
            For collection previews, private appointments, and bespoke tailoring inquiries.
          </p>
          <a className="contact-email" href="mailto:hello@maisonaura.com">
            hello@maisonaura.com
          </a>
        </div>
      </section>

      <p className="contact-note">
        Please include your order reference, preferred consultation window, and any tailoring
        preferences when contacting us for an expedited response.
      </p>
    </div>
  )
}

export default ContactSupport
