function StockOverview({ stock, atelierPending }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="admin-card" style={{ flex: 3, marginBottom: 0 }}>
                <h3 style={{ textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Stock Overview</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Variants</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stock.total_variants}</h2>
                        <p style={{ color: '#888', fontSize: '13px' }}>across all products</p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Out of Stock</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#ef4444' }}>{stock.out_of_stock}</h2>
                        <p style={{ color: '#888', fontSize: '13px' }}>variants at 0</p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Low Stock</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#f59e0b' }}>{stock.low_stock}</h2>
                        <p style={{ color: '#888', fontSize: '13px' }}>5 or fewer units</p>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ flex: 1, textAlign: 'center', marginBottom: 0 }}>
                <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Atelier Requests</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#d4af37' }}>{atelierPending}</h2>
                <p style={{ color: '#888', fontSize: '13px' }}>pending fittings</p>
            </div>
        </div>
    )
}
export default StockOverview