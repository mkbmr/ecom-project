import { useState } from 'react'
import { CartContext } from './useCart'

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existing = prev.find(i => i.variantId === item.variantId)

            if (existing) {
                return prev.map(i =>
                    i.variantId === item.variantId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }

            return [...prev, { ...item, quantity: 1 }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (variantId) => {
        setCartItems((prev) => prev.filter(i => i.variantId !== variantId))
    }

    const updateQuantity = (variantId, quantity) => {
        setCartItems((prev) =>
            prev.map(i => i.variantId === variantId ? { ...i, quantity } : i)
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
            cartTotal, cartCount, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}