import { useState, useEffect } from 'react'

function StockChecking() {
    const [variants, setVariants] = useState([])
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('asc')

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stock`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                const data = await res.json()
                setVariants(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchVariants()
    }, [])

    const filtered = variants
        .filter(v => category === 'all' || v.category === category)
        .filter(v => v.sku?.toLowerCase().includes(search.toLowerCase()) ||
                     v.product_name?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sortBy === 'asc' ? a.stock - b.stock : b.stock - a.stock)

    return (
        <div className="admin-card">
            <h3 style={{ textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Stock Checking</h3>

            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                <input
                    placeholder="Search by SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 2, padding: '8px' }}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1, padding: '8px' }}>
                    <option value="all">All Categories</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, padding: '8px' }}>
                    <option value="asc">Stock: Low → High</option>
                    <option value="desc">Stock: High → Low</option>
                </select>
            </div>

            <table className="admin-table" style={{ fontSize: '13px' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Product</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(v => (
                        <tr key={v.id}>
                            <td style={{ fontWeight: 'bold' }}>{v.product_name}</td>
                            <td style={{ textAlign: 'left', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.5px' }}>{v.sku}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{
                                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                                    background: v.category === 'men' ? '#eff6ff' : '#fdf2f8',
                                    color: v.category === 'men' ? '#3b82f6' : '#ec4899'
                                }}>
                                    {v.category?.toUpperCase()}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>{v.color}</td>
                            <td style={{ textAlign: 'center' }}>{v.size}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span className={`stock-badge ${v.stock === 0 ? 'stock-badge--out' : v.stock <= 5 ? 'stock-badge--low' : 'stock-badge--ok'}`}>
                                    {v.stock === 0 ? 'Out of Stock' : `${v.stock} left`}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default StockChecking