import { Link } from "react-router-dom";
function Footer() {
    return (
        <footer className="footer">
            <ul className="footer-col"> 
                <li className="footer-title">COLLECTIONS</li> 
                <li><Link to="shop/men">Mens's Collection</Link></li> 
                <li><Link to="shop/women">Womens's Collection</Link></li> 
                <li><Link to="shop/all">The Collection</Link></li>
            </ul>  

            <ul className="footer-col"> 
                <li className="footer-title">THE HOUSE</li> 
                <li><Link to="/about">Our Heritage</Link></li> 
                <li><Link to="#">Private Salons</Link></li> 
                <li><Link to="#">Crasftsmanship</Link></li>
            </ul> 

            <ul className="footer-col"> 
                <li className="footer-title">CONCIERGE</li> 
                <li><Link to="/contact">Contact Support</Link></li> 
                <li><Link to="#">Delivery & Returns</Link></li> 
                <li><Link to="#">Garment Care</Link></li>
            </ul> 

            <ul className="footer-col"> 
                <li className="footer-title">OPENING HOURS</li> 
                <li>Monday - Friday: 10am - 9pm</li> 
                <li>Saturday: 10am - 6pm</li> 
                <li>Sunday: 11pm - 5pm</li>
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