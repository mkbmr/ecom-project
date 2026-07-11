function CategorySplit({ data }) {
    const total = data.reduce((sum, c) => sum + Number(c.revenue), 0)

    return (
        <div className="admin-card">
            <h3 style={{ textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Revenue by Category</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {data.map(c => (
                    <div key={c.category} style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#fafafa', borderRadius: '8px' }}>
                        <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.category}</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${Number(c.revenue).toFixed(2)}</h2>
                        <p style={{ color: '#888', fontSize: '13px' }}>{c.orders} orders</p>
                        <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '6px', marginTop: '0.5rem' }}>
                            <div style={{
                                background: c.category === 'men' ? '#3b82f6' : '#ec4899',
                                width: `${total > 0 ? (Number(c.revenue) / total * 100) : 0}%`,
                                height: '100%', borderRadius: '4px'
                            }} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                            {total > 0 ? Math.round(Number(c.revenue) / total * 100) : 0}% of total
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CategorySplit