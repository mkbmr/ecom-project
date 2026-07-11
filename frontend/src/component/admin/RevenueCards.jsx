function RevenueCards({ overview }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div className="admin-card" style={{ flex: 1, textAlign: 'center', marginBottom: 0 }}>
                <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>Today's Revenue</p>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${Number(overview.today.revenue).toFixed(2)}</h2>
                <p style={{ color: '#888', fontSize: '13px' }}>{overview.today.orders} orders today</p>
            </div>
            <div className="admin-card" style={{ flex: 1, textAlign: 'center', marginBottom: 0 }}>
                <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>This Month</p>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${Number(overview.month.revenue).toFixed(2)}</h2>
                <p style={{ color: '#888', fontSize: '13px' }}>{overview.month.orders} orders this month</p>
            </div>
            <div className="admin-card" style={{ flex: 1, textAlign: 'center', marginBottom: 0 }}>
                <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>All-Time Revenue</p>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${Number(overview.allTime.revenue).toFixed(2)}</h2>
                <p style={{ color: '#888', fontSize: '13px' }}>{overview.allTime.orders} total orders</p>
            </div>
        </div>
    )
}
export default RevenueCards
