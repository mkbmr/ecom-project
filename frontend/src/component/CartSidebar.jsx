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
        <div style={{
            position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh',
            background: 'white', boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
            padding: '1.5rem', overflowY: 'auto', zIndex: 1000
        }}>
            <button onClick={() => setIsCartOpen(false)}>Close</button>
            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.variantId} style={{ borderBottom: '1px solid #eee', padding: '0.75rem 0' }}>
                            <p>{item.productName}</p>
                            <p>{item.color} / {item.size}</p>
                            <p>${item.price.toFixed(2)}</p>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.variantId, Number(e.target.value))}
                                style={{ width: '50px' }}
                            />
                            <button onClick={() => removeFromCart(item.variantId)}>Remove</button>
                        </div>
                    ))}

                    <h3>Total: ${cartTotal.toFixed(2)}</h3>
                    
                    {checkoutError && <p style={{ color: 'red' }}>{checkoutError}</p>}

                    <button onClick={handleCheckout} disabled={loading}>
                        {loading ? 'Processing...' : 'Checkout'}
                    </button>
                </>
            )}
        </div>
    )
}
export default CartSidebar