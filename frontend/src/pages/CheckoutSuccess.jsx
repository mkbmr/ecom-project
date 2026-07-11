import { useSearchParams, Link } from 'react-router-dom'

function CheckoutSuccess() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="success-page">
            <div className="success-card">
                <div className="success-icon" aria-hidden="true">
                    <svg viewBox="0 0 52 52" fill="none">
                        <circle cx="26" cy="26" r="25" stroke="#d4af37" strokeWidth="1.5" />
                        <path d="M15 27.5L22.5 35L37.5 18" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p className="success-eyebrow">Order Confirmed</p>
                <h1 className="success-headline">Thank You</h1>
                {orderId && (
                    <div className="success-order-ref">
                        <span>Order Reference</span>
                        <strong>#{orderId}</strong>
                    </div>
                )}
                <p className="success-subtitle">
                    Your order has been placed with Maison Aura. A confirmation has been
                    sent to your inbox, and our atelier will begin preparing your pieces shortly.
                </p>
                <Link to="/shop/all" className="btn-return">Continue Shopping</Link>
            </div>
        </div>
    )
}
export default CheckoutSuccess
