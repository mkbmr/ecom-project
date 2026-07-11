function RecentOrders({ orders }) {
    return (
        <div className="admin-card">
            <h3 style={{ textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Recent Orders</h3>
            <table className="admin-table" style={{ fontSize: '13px', marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Order</th>
                        <th style={{ textAlign: 'left' }}>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>#{o.id}</td>
                            <td>
                                <div style={{ fontWeight: 'bold' }}>{o.full_name || 'Guest'}</div>
                                <div style={{ color: '#888', fontSize: '12px' }}>{o.email}</div>
                            </td>
                            <td style={{ textAlign: 'center' }}>${Number(o.total_amount).toFixed(2)}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{
                                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                                    background: o.status === 'pending' ? '#f3f4f6' : '#f0fdf4',
                                    color: o.status === 'pending' ? '#6b7280' : '#22c55e'
                                }}>
                                    {o.status}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center', color: '#888' }}>
                                {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default RecentOrders