import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from './CartContext'

function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [variants, setVariants] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [productRes, variantsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/products/${id}`),
                    fetch(`http://localhost:5000/api/products/${id}/variants`)
                ])

                const productData = await productRes.json()
                const variantsData = await variantsRes.json()

                setProduct(productData)
                setVariants(variantsData)
            } catch (err) {
                console.error(err)
            }
            setLoading(false)
        }

        fetchData()
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!product) return <p>Product not found.</p>

    const availableColors = [...new Set(variants.map(v => v.color))]
    const availableSizes = [...new Set(
        variants.filter(v => v.color === selectedColor).map(v => v.size)
    )]

    const selectedVariant = variants.find(
        v => v.color === selectedColor && v.size === selectedSize
    )

    const handleAddToCart = () => {
        addToCart({
            variantId: selectedVariant.id,
            productName: product.product_name,
            color: selectedVariant.color,
            size: selectedVariant.size,
            price: Number(product.price),
            image: product.image_url,
        })
    }

    return (
        <div className="product-detail-page">
            <img src={product.image_url} alt={product.product_name} width="200" />

            <h1>{product.product_name}</h1>
            <p>{product.type}</p>
            <p>${Number(product.price).toFixed(2)}</p>
            <p>{product.descriptions}</p>

            <div>
                <label>Color:</label>
                <select
                    value={selectedColor}
                    onChange={(e) => {
                        setSelectedColor(e.target.value)
                        setSelectedSize('')
                    }}
                >
                    <option value="">Select a color</option>
                    {availableColors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Size:</label>
                <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    disabled={!selectedColor}
                >
                    <option value="">Select a size</option>
                    {availableSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            {selectedVariant && (
                <p>
                    {selectedVariant.stock > 0
                        ? `${selectedVariant.stock} in stock`
                        : 'Out of stock'}
                </p>
            )}

            <button
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
        </div>
    )
}
export default ProductDetail