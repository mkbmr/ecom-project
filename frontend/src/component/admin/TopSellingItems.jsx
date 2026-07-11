function TopSellingItems({ items }) {
    return (
        <div className="admin-card">
            <h3 style={{ textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Top Selling Items</h3>
            <table className="admin-table" style={{ fontSize: '13px', marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th style={{ textAlign: 'left' }}>Product</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center', color: '#888' }}>{index + 1}</td>
                            <td style={{ fontWeight: 'bold' }}>{item.product_name}</td>
                            <td style={{ textAlign: 'center' }}>{item.color}</td>
                            <td style={{ textAlign: 'center' }}>{item.size}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.units_sold}</td>
                            <td style={{ textAlign: 'center' }}>${Number(item.revenue).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default TopSellingItems