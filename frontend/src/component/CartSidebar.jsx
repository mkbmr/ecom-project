import { useCart } from '../pages/CartContext'

function CartSidebar() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart()

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
                    <button>Checkout</button>
                </>
            )}
        </div>
    )
}
export default CartSidebar