// pages/Collection.jsx
import { useParams } from 'react-router-dom'

const allProducts = [
  { id: 1, name: "Silk Blouse", category: "women" },
  { id: 2, name: "Wool Coat", category: "men" },
  { id: 3, name: "Cashmere Scarf", category: "women" },
  { id: 4, name: "Tailored Suit", category: "men" },
  { id: 5, name: "Leather Loafers", category: "men" },
  { id: 6, name: "Silk Gown", category: "women" },
]

function Collection() {
  const { category } = useParams() // reads "female", "male", or "all" from the URL

  const filtered = category === "all"
    ? allProducts
    : allProducts.filter(p => p.category === category)

  const title = category === "all" ? "The Collection"
    : category === "men" ? "Men's Collection"
    : "Women's Collection"

  return (
    <div className="collection-page">
      <h1>{title}</h1>
      <div className="grid">
        {filtered.map(p => (
          <div key={p.id} className="product-card">{p.name}</div>
        ))}
      </div>
    </div>
  )
}
export default Collection