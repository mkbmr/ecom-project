import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function CustomersTab() {
    const [customers, setCustomers] = useState([])
    const [customersLoading, setCustomersLoading] = useState(true)
    const [expandedCustomerId, setExpandedCustomerId] = useState(null)
    const [customerOrders, setCustomerOrders] = useState([])

    const fetchCustomers = async () => {
        setCustomersLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/admin/customers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json()
            setCustomers(data)
        } catch (err) {
            console.error(err)
        }
        setCustomersLoading(false)
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomerOrders = async (customerId) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/customers/${customerId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json()
            setCustomerOrders(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleToggleCustomer = (customerId) => {
        if (expandedCustomerId === customerId) {
            setExpandedCustomerId(null)
            setCustomerOrders([])
        } else {
            setExpandedCustomerId(customerId)
            fetchCustomerOrders(customerId)
        }
    }

    return (
        <div className="admin-card">
            <div className="admin-header-row">
                <h1 className="admin-page-title">Customers ({customers.length})</h1>
            </div>

            {customersLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Total Orders</th>
                            <th>Total Spend</th>
                            <th>Last Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <>
                                <tr key={c.id}>
                                    <td className="atelier-customer-name">{c.full_name}</td>
                                    <td className="atelier-contact-email">{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td className="atelier-cell-center">{c.total_orders}</td>
                                    <td className="atelier-cell-center">${Number(c.total_spend).toFixed(2)}</td>
                                    <td className={c.last_order ? '' : 'atelier-color-muted'}>
                                        {c.last_order
                                            ? new Date(c.last_order).toLocaleDateString()
                                            : 'No orders yet'}
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="row-action-btn" onClick={() => handleToggleCustomer(c.id)}>
                                                {expandedCustomerId === c.id ? 'Hide Orders' : 'View Orders'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {expandedCustomerId === c.id && (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="admin-subpanel">
                                                <h4>Orders for {c.full_name}</h4>

                                                {customerOrders.length === 0 ? (
                                                    <p>No orders yet.</p>
                                                ) : (
                                                    customerOrders.map(order => (
                                                        <div key={order.order_id} style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1rem' }}>
                                                            <p>
                                                                <strong>Order #{order.order_id}</strong> —
                                                                {new Date(order.created_at).toLocaleDateString()} —
                                                                ${Number(order.total_amount).toFixed(2)} —
                                                                <span>{order.status}</span>
                                                            </p>

                                                            <table className="admin-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Product</th>
                                                                        <th>Color</th>
                                                                        <th>Size</th>
                                                                        <th>Qty</th>
                                                                        <th>Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order.items.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.product_name}</td>
                                                                            <td>{item.color}</td>
                                                                            <td>{item.size}</td>
                                                                            <td>{item.quantity}</td>
                                                                            <td>${Number(item.price).toFixed(2)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
export default CustomersTab
