import { Link } from 'react-router-dom'

function Welcome() {
    return (
        <div className="welcome-hero">
            <p className="welcome-eyebrow">Maison Aura</p>
            <h1 className="welcome-headline">Tailoring Without Compromise</h1>
            <p className="welcome-subtitle">
                Discover the season's private collection, cut for those who command a room.
            </p>
            <Link to="/shop/all" className="btn-return">Explore the Collection</Link>
        </div>
    )
}
export default Welcome
