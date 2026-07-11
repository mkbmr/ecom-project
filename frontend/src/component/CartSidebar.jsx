import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../pages/CartContext'

function CartSidebar() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()

    const navigate = useNavigate()
    const [checkoutError, setCheckoutError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCheckout = async () => {
        setCheckoutError('')

        const token = localStorage.getItem('token')

        if (!token) {
            setIsCartOpen(false)
            navigate('/login?message=Please log in to check out.')
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems: cartItems.map(item => ({
                        variantId: item.variantId,
                        productId: item.productId,
                        productName: item.productName,
                        color: item.color,
                        size: item.size,
                        price: item.price,
                        quantity: item.quantity,
                    }))
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setCheckoutError(data.error || 'Checkout failed.')
                setLoading(false)
                return
            }

            clearCart()
            setIsCartOpen(false)
            navigate(`/checkout-success?orderId=${data.orderId}`)

        } catch (err) {
            console.error(err)
            setCheckoutError('Could not connect to server.')
            setLoading(false)
        }
    }

    if (!isCartOpen) return null

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />

            <div className="cart-sidebar">
                <div className="cart-header">
                    <h2>Your Bag ({cartItems.length})</h2>
                    <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">Your bag is empty.</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.variantId} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.productName} />
                                    </div>

                                    <div className="cart-item-details">
                                        <p className="cart-item-name">{item.productName}</p>
                                        <p className="cart-item-meta">{item.color} / {item.size}</p>
                                        <p className="cart-item-price">${item.price.toFixed(2)}</p>

                                        <div className="cart-item-row">
                                            <input
                                                className="cart-item-qty"
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.variantId, Number(e.target.value))}
                                            />
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item.variantId)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-subtotal">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>

                            {checkoutError && <p className="cart-error">{checkoutError}</p>}

                            <button className="cart-checkout-btn" onClick={handleCheckout} disabled={loading}>
                                {loading ? 'Processing...' : 'Checkout'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
export default CartSidebar
