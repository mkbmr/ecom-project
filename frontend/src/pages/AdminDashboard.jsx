import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../component/Logo'

function AdminDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')

    // --- Products state (only used when activeTab === 'products') ---
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({
        product: '', descriptions: '', sku: '', category: 'male',
        type: '', price: '', image: '', stock: '',
    })
    const [formError, setFormError] = useState('')
    const [editingId, setEditingId] = useState(null)

    // --- Protect this page: redirect if not logged in as admin ---
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user || user.role !== 'admin') {
            navigate('/login?message=You must be logged in as an admin.')
        }
    }, [])

    const handleCancel = () => {
        setShowAddForm(false)
        setEditingId(null)
        setFormData({ product: '', descriptions: '', sku: '', category: 'male', type: '', price: '', image: '', stock: '' })
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/products')
            const data = await res.json()
            setProducts(data)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts()
        }
    }, [activeTab])

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleEditClick = (p) => {
        setFormData({
            product: p.product_name,
            descriptions: p.descriptions,
            sku: p.sku,
            category: p.category,
            type: p.type,
            price: p.price,
            image: p.image_url,
            stock: p.stock,
        })
        setEditingId(p.id)
        setShowAddForm(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        const url = editingId
            ? `http://localhost:5000/api/products/${editingId}`
            : 'http://localhost:5000/api/products'
        const method = editingId ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()

            if (!res.ok) {
                setFormError(data.error || 'Failed to save product.')
                return
            }

            setShowAddForm(false)
            setEditingId(null)
            setFormData({ product: '', descriptions: '', sku: '', category: 'male', type: '', price: '', image: '', stock: '' })
            fetchProducts()

        } catch (err) {
            console.error(err)
            setFormError('Could not connect to server.')
        }
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?')
        if (!confirmed) return

        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            if (!res.ok) {
                alert('Failed to delete product.')
                return
            }

            fetchProducts()
        } catch (err) {
            console.error(err)
            alert('Could not connect to server.')
        }
    }

const [expandedProductId, setExpandedProductId] = useState(null)
const [variants, setVariants] = useState([])
const [newVariant, setNewVariant] = useState({ color: '', size: '', stock: '' })

const fetchVariants = async (productId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/variants`)
        const data = await res.json()
        setVariants(data)
    } catch (err) {
        console.error(err)
    }
}

const handleToggleStock = (productId) => {
    if (expandedProductId === productId) {
        setExpandedProductId(null)
        setVariants([])
    } else {
        setExpandedProductId(productId)
        setNewVariant({ color: '', size: '', stock: '' })
        fetchVariants(productId)
    }
}

const handleNewVariantChange = (e) => {
    setNewVariant({ ...newVariant, [e.target.name]: e.target.value })
}

const handleAddVariant = async (productId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/variants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newVariant),
        })
        const data = await res.json()

        if (!res.ok) {
            alert(data.error || 'Could not add variant.')
            return
        }

        setNewVariant({ color: '', size: '', stock: '' })
        fetchVariants(productId)
    } catch (err) {
        console.error(err)
        alert('Could not connect to server.')
    }
}

const handleUpdateVariantStock = async (variantId, newStock, productId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/variants/${variantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ stock: newStock }),
        })

        if (!res.ok) {
            alert('Could not update stock.')
            return
        }

        fetchVariants(productId)
    } catch (err) {
        console.error(err)
        alert('Could not connect to server.')
    }
}

const handleDeleteVariant = async (variantId, productId) => {
    const confirmed = window.confirm('Delete this variant?')
    if (!confirmed) return

    try {
        const res = await fetch(`http://localhost:5000/api/variants/${variantId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })

        if (!res.ok) {
            alert('Could not delete variant.')
            return
        }

        fetchVariants(productId)
    } catch (err) {
        console.error(err)
        alert('Could not connect to server.')
    }
}

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <Logo />
                    <p>ADMIN PORTAL</p>
                </div>

                <ul className="admin-nav">
                    <li><button onClick={() => setActiveTab('overview')}>Overview</button></li>
                    <li><button onClick={() => setActiveTab('products')}>Products</button></li>
                    <li><button onClick={() => setActiveTab('customers')}>Customers</button></li>
                    <li><button onClick={() => setActiveTab('atelier')}>Atelier</button></li>
                </ul>

                <ul className="admin-sidebar-footer">
                    <li><button onClick={() => navigate('/shop/all')}>← Back to Store</button></li>
                    <li><button onClick={handleLogout}>Sign Out</button></li>
                </ul>
            </aside>

            <main className="admin-content">
                {activeTab === 'overview' && <h1>Sales Overview</h1>}

                {activeTab === 'products' && (
                    <div>
                        <div className="admin-header-row">
                            <h1>Products ({products.length})</h1>
                            <div>
                                <button onClick={() => {
                                    setShowAddForm(!showAddForm)
                                    setEditingId(null)
                                    setFormData({ product: '', descriptions: '', sku: '', category: 'men', type: '', price: '', image: '', stock: '' })
                                }}>+ Add Product
                                </button>
                            </div>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleFormSubmit}>
                                {formError && <p style={{ color: 'red' }}>{formError}</p>}

                                <input name="product" placeholder="Product Name" value={formData.product} onChange={handleFormChange} required />
                                <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleFormChange} required />
                                <select name="category" value={formData.category} onChange={handleFormChange}>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                </select>
                                <input name="type" placeholder="Type (e.g. Tuxedo)" value={formData.type} onChange={handleFormChange} required />
                                <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleFormChange} required />
                                <input name="image" placeholder="Image URL" value={formData.image} onChange={handleFormChange} required />
                                <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleFormChange} />
                                <textarea name="descriptions" placeholder="Description" value={formData.descriptions} onChange={handleFormChange} />

                                <button type="submit">{editingId ? 'Update Product' : 'Save Product'}</button>
                                <button type="button" onClick={handleCancel}>Cancel</button>
                            </form>
                        )}

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {products.map((p) => (
                                <>
                                    <tr key={p.id}>
                                        <td><img src={p.image_url} alt={p.product_name} width="60"/></td>
                                        <td>{p.product_name}</td>
                                        <td>{p.sku}</td>
                                        <td>{p.category}</td>
                                        <td>{p.type}</td>
                                        <td>${Number(p.price).toFixed(2)}</td>
                                        <td>{p.total_stock}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(p)}>Edit</button>
                                            <button onClick={() => handleToggleStock(p.id)}>Stock</button>
                                            <button onClick={() => handleDelete(p.id)}>Delete</button>
                                        </td>
                                    </tr>

                                    {expandedProductId === p.id && (
                                        <tr>
                                            <td colSpan="8">
                                                <div style={{ background: '#f5f5f5', padding: '1rem' }}>
                                                    <h4>Variants for {p.product_name}</h4>

                                                    {variants.length === 0 ? (
                                                        <p>No variants yet.</p>
                                                    ) : (
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>SKU</th>
                                                                    <th>Color</th>
                                                                    <th>Size</th>
                                                                    <th>Stock</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {variants.map((v) => (
                                                                    <tr key={v.id}>
                                                                        <td>{v.variant_sku}</td>
                                                                        <td>{v.color}</td>
                                                                        <td>{v.size}</td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                defaultValue={v.stock}
                                                                                onBlur={(e) => handleUpdateVariantStock(v.id, e.target.value, p.id)}
                                                                                style={{ width: '60px' }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <button onClick={() => handleDeleteVariant(v.id, p.id)}>Delete</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}

                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <input name="color" placeholder="Color" value={newVariant.color} onChange={handleNewVariantChange} />
                                                        <select name="size" value={newVariant.size} onChange={handleNewVariantChange}>
                                                            <option value="">Size</option>
                                                            <option value="S">S</option>
                                                            <option value="M">M</option>
                                                            <option value="L">L</option>
                                                            <option value="XL">XL</option>
                                                            <option value="Atelier Fitting">Atelier Fitting</option>
                                                        </select>
                                                        <input name="stock" type="number" placeholder="Stock" value={newVariant.stock} onChange={handleNewVariantChange} />
                                                        <button onClick={() => handleAddVariant(p.id)}>+ Add Variant</button>
                                                    </div>
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
                )}

                {activeTab === 'customers' && <h1>Customers</h1>}
                {activeTab === 'atelier' && <h1>Atelier</h1>}
            </main>
        </div>
    )
}
export default AdminDashboard