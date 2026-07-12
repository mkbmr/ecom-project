import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../pages/useCart'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
    developerTools: {
        assistant: {
            enabled: false,
        },
    },
})

function CheckoutForm({ onSuccess }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setLoading(true)
        setError('')

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout-success`,
            },
            redirect: 'if_required'
        })

        if (stripeError) {
            setError(stripeError.message)
            setLoading(false)
        } else {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {error && <p className="cart-error">{error}</p>}
            <button className="cart-checkout-btn" type="submit" disabled={!stripe || loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    )
}

function CartSidebar() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()

    const navigate = useNavigate()
    const [checkoutError, setCheckoutError] = useState('')
    const [loading, setLoading] = useState(false)
    const [clientSecret, setClientSecret] = useState('')
    const [showPayment, setShowPayment] = useState(false)

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
            const user = JSON.parse(localStorage.getItem('user'))

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
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
                    })),
                    userId: user?.id || null
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setCheckoutError(data.error || 'Could not initiate checkout.')
                setLoading(false)
                return
            }

            setClientSecret(data.clientSecret)
            setShowPayment(true)
            setLoading(false)

        } catch (err) {
            console.error(err)
            setCheckoutError('Could not connect to server.')
            setLoading(false)
        }
    }

    const handlePaymentSuccess = () => {
        clearCart()
        setIsCartOpen(false)
        setShowPayment(false)
        setClientSecret('')
        navigate('/checkout-success')
    }

    const closeCart = () => {
        setIsCartOpen(false)
        setShowPayment(false)
        setClientSecret('')
        setCheckoutError('')
    }

    if (!isCartOpen) return null

    return (
        <>
            <div className="cart-overlay" onClick={closeCart} />

            <div className="cart-sidebar">
                <div className="cart-header">
                    <h2>Your Bag ({cartItems.length})</h2>
                    <button className="cart-close-btn" onClick={closeCart}>&times;</button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">Your bag is empty.</p>
                ) : !showPayment ? (
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
                ) : (
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <p className="cart-payment-note">
                            Test card: 4242 4242 4242 4242 &middot; Any future date &middot; Any CVC
                        </p>

                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm onSuccess={handlePaymentSuccess} />
                            </Elements>
                        )}

                        <button
                            className="cart-payment-back"
                            onClick={() => {
                                setShowPayment(false)
                                setClientSecret('')
                            }}
                        >
                            &larr; Back to Bag
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
export default CartSidebar
