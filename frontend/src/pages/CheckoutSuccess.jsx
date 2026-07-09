import { useSearchParams, Link } from 'react-router-dom'

function CheckoutSuccess() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div>
            <h1>Order Confirmed!</h1>
            {orderId && <p>Your order reference: #{orderId}</p>}
            <p>Thank you for shopping with Maison Aura.</p>
            <Link to="/shop/all">Continue Shopping</Link>
        </div>
    )
}
export default CheckoutSuccess