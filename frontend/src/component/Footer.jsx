import { Link } from "react-router-dom";
function Footer() {
    return (
        <footer className="footer">
            <ul className="footer-col"> 
                <li className="footer-title">COLLECTIONS</li> 
                <li><Link to="shop/men">Men's Ready-To-Wear</Link></li>
                <li><Link to="shop/women">Women's Tailoring</Link></li>
                <li><Link to="shop/all">The Atelier Collection</Link></li>
            </ul>  

            <ul className="footer-col"> 
                <li className="footer-title">THE HOUSE</li> 
                <li><Link to="/about">Our Heritage</Link></li> 
                <li><Link to="#">Private Salons</Link></li> 
                <li><Link to="#">Craftsmanship</Link></li>
            </ul> 

            <ul className="footer-col"> 
                <li className="footer-title">CONCIERGE</li> 
                <li><Link to="/contact">Contact Support</Link></li> 
                <li><Link to="#">Delivery & Returns</Link></li> 
                <li><Link to="#">Garment Care</Link></li>
            </ul> 

            <ul className="footer-col"> 
                <li className="footer-title">ATELIER HOURS</li>
                <li>Mon — Fri 10:00 — 21:00</li>
                <li>Saturday 10:00 — 18:00</li>
                <li>Sunday 11:00 — 17:00</li>
            </ul> 

        <div className="footer-divider" />

        <div className="footer-bottom">
            <p className="copyright"> &copy; 2026 MaisonAura. ALL RIGHTS RESERVED. 
            <br />Privacy Policy | Terms of Use | Accessibility
            </p>

            <ul className="footer-social"> 
                <li>Instagram</li> 
                <li>Tiktok</li>
                <li>Pinterest</li>
            </ul>
        </div>
        </footer>
    );
}

export default Footer;