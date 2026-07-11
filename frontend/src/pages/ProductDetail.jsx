import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from './CartContext'

const MEASUREMENTS = {
    men: {
        eyebrow: "MEN'S MEASUREMENTS",
        title: 'Regal Structure',
        columns: ['Atelier Size', 'Chest (cm)', 'Bust (cm)', 'Waist (cm)', 'Required Size'],
        rows: [
            ['46 (S)', '94 - 97', '95 - 98', '80 - 83', 'S'],
            ['48 (M)', '98 - 101', '99 - 102', '84 - 87', 'M'],
            ['50 (L)', '102 - 105', '103 - 106', '88 - 91', 'L'],
            ['52 (XL)', '106 - 109', '107 - 110', '92 - 95', 'XL'],
        ],
    },
    women: {
        eyebrow: "WOMEN'S MEASUREMENTS",
        title: 'Femininity in Precision',
        columns: ['Atelier Size', 'Bust (cm)', 'Waist (cm)', 'Shoulder (cm)', 'Required Size'],
        rows: [
            ['34 (XS)', '80 - 83', '62 - 65', '37.5', 'S'],
            ['36 (S)', '84 - 87', '66 - 69', '38.5', 'S'],
            ['38 (M)', '88 - 91', '70 - 73', '39.5', 'M'],
            ['40 (L)', '92 - 95', '74 - 77', '40.5', 'L'],
        ],
    },
}

function MeasurementsTable({ category }) {
    const table = MEASUREMENTS[category]
    if (!table) return null

    return (
        <div className="measurements-wrapper">
            <p className="measurements-eyebrow">{table.eyebrow}</p>
            <h3 className="measurements-title">{table.title}</h3>

            <table className="measurements-table">
                <thead>
                    <tr>
                        {table.columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

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
                    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/variants`)
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
            productId: product.id,
            productName: product.product_name,
            color: selectedVariant.color,
            size: selectedVariant.size,
            price: Number(product.price),
            image: product.image_url,
        })
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-image">
                <img src={product.image_url} alt={product.product_name} />
            </div>

            <div className="product-detail-info">
                <p className="product-detail-type">{product.type}</p>
                <h1>{product.product_name}</h1>
                <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
                <p className="product-detail-sku">SKU: {selectedVariant ? selectedVariant.variant_sku : product.sku}</p>

                <p className="product-detail-desc">{product.descriptions}</p>

                <div className="product-detail-divider" />

                <div className="product-detail-field">
                    <label>Color</label>
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

                <div className="product-detail-field">
                    <label>Size</label>
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
                    <p className={`product-detail-stock ${selectedVariant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {selectedVariant.stock > 0
                            ? `${selectedVariant.stock} in stock`
                            : 'Out of stock'}
                    </p>
                )}

                <button
                    className="product-detail-add-btn"
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>

                <MeasurementsTable category={product.category} />
            </div>
        </div>
    )
}
export default ProductDetail
