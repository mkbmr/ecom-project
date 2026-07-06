function Footer() {
    return (
        <footer className="footer">
            <ul className="footer-col"> 
                <li className="footer-title">COLLECTIONS</li> 
                <li><a href="#">Mens's Collection</a></li> 
                <li><a href="#">Womens's Collection</a></li> 
                <li><a href="#">The Aterlier Collection</a></li>
            </ul>  

            <ul className="footer-col"> 
                <li className="footer-title">THE HOUSE</li> 
                <li><a href="#">Our Heritage</a></li> 
                <li><a href="#">Private Salons</a></li> 
                <li><a href="#">Crasftmanship</a></li>
            </ul> 

            <ul className="footer-col"> 
                <li className="footer-title">CONCIERGE</li> 
                <li><a href="#">Contact Support</a></li> 
                <li><a href="#">Delivery & Returns</a></li> 
                <li><a href="#">Garment Care</a></li>
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