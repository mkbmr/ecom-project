import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../pages/CartContext'

function Header() {
    const { cartCount, setIsCartOpen, clearCart } = useCart()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const handleLogout = () => {
        clearCart()
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <header>
            <div className="header-announcement">
                <p>COMPLIMENTARY PRIVATE ATELIER FITTING &amp; GLOBAL WHITE-GLOVE SHIPPING</p>
            </div>

            <nav className="header-nav">
                <div className="header-nav-left">
                    <Link to="/shop/women">Women</Link>
                    <Link to="/shop/men">Men</Link>
                    <Link to="/shop/all">The Collections</Link>
                </div>

                <Link to="/shop/all" className="header-logo">
                    <Logo />
                </Link>

                <div className="header-nav-right">
                    {user?.role === 'admin' && (
                        <Link to="/dashboard" className="header-admin-link">Admin Dashboard</Link>
                    )}

                    {user ? (
                        <>
                            <Link to="/orders" className="header-text-btn">My Orders</Link>
                            <button className="header-text-btn" onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="header-text-btn">Sign In</Link>
                    )}

                    <button className="header-bag-btn" onClick={() => setIsCartOpen(true)}>
                        Bag ({cartCount})
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;
