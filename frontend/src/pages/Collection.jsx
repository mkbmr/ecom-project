import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Collection() {
    const { category } = useParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                console.error(err)
            }
            setLoading(false)
        }

        fetchProducts()
    }, [])

    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category)

    const title = category === 'all' ? 'The Collection'
        : category === 'men' ? "Men's Collection"
        : "Women's Collection"

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h1>{title}</h1>
                <div className="collection-divider" />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid">
                    {filtered.map(p => (
                        <Link to={`/product/${p.id}`} key={p.id} className="product-card-link">
                            <div className="product-card">
                                <div className="product-card-image">
                                    <img src={p.image_url} alt={p.product_name} />
                                </div>
                                <h3>{p.product_name}</h3>
                                <p className="product-card-type">{p.type}</p>
                                <p className="product-card-price">${Number(p.price).toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Collection