import { createContext, useContext } from 'react'

// Context lives here (not in CartContext.jsx) so that file only exports
// the provider component — required for Vite fast refresh to work on it.
export const CartContext = createContext()

export function useCart() {
    return useContext(CartContext)
}
