import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../pages/CartContext'

function Header() {
    const { cartCount, setIsCartOpen } = useCart()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <header className="App-header">
            <div className="Header-Message">
                <p> COMPLEMENTARY PRIVATE ATELIER FITTING & GLOBAL WHITE-GLOVE SHIPPING</p>
            </div>
            <br />
            <hr />
            <br />
            <nav>
                <Link to="/shop/women"> Women </Link> |
                <Link to="/shop/men"> Men </Link> |

                <Link to="/shop/all" className="maison-logo-svg-wrapper">
                <Logo />
                </Link>

                {user ? (
                    <>
                        <span>Welcome, {user.fullName}</span> |
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link> |
                        <Link to="/register">Signup</Link>
                        
                    </>
                )}

                <button onClick={() => setIsCartOpen(true)}>
                    Cart ({cartCount})
                </button>
            </nav>
        </header>
    );
}

export default Header;