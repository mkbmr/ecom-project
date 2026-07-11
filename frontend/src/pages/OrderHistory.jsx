import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function OrderHistory() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?message=Please log in to view your order history.')
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/api/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || 'Could not load your order history.')
                    return
                }

                setOrders(data)
            } catch (err) {
                console.error(err)
                setError('Could not connect to server.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [navigate])

    const totalSpend = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)

    return (
        <div className="order-history-page">
            <div className="order-history-hero">
                <p className="order-history-eyebrow">Your Account</p>
                <h1 className="order-history-headline">Spending History</h1>
            </div>

            {loading ? (
                <p className="order-history-status">Loading your orders...</p>
            ) : error ? (
                <p className="order-history-status order-history-error">{error}</p>
            ) : orders.length === 0 ? (
                <p className="order-history-status">You haven&rsquo;t placed any orders yet.</p>
            ) : (
                <>
                    <div className="order-history-summary">
                        <div>
                            <span>Total Orders</span>
                            <strong>{orders.length}</strong>
                        </div>
                        <div>
                            <span>Total Spend</span>
                            <strong>${totalSpend.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="order-history-list">
                        {orders.map(order => (
                            <div key={order.order_id} className="order-history-card">
                                <div className="order-history-card-header">
                                    <div>
                                        <p className="order-history-card-title">Order #{order.order_id}</p>
                                        <p className="order-history-card-date">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="order-history-card-meta">
                                        <span className={`order-history-status-badge order-history-status-${order.status}`}>
                                            {order.status}
                                        </span>
                                        <strong>${Number(order.total_amount).toFixed(2)}</strong>
                                    </div>
                                </div>

                                <div className="order-history-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-history-item">
                                            <span>{item.product_name} &mdash; {item.color} / {item.size}</span>
                                            <span>{item.quantity} &times; ${Number(item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
export default OrderHistory
