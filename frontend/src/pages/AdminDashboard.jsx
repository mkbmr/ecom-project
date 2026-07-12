import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../component/Logo'
import OverviewTab from './admin/OverviewTab'
import ProductsTab from './admin/ProductsTab'
import CustomersTab from './admin/CustomersTab'
import AtelierTab from './admin/AtelierTab'

function AdminDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')

    // --- Protect this page: redirect if not logged in as admin ---
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user || user.role !== 'admin') {
            navigate('/login?message=You must be logged in as an admin.')
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <Logo />
                    <p>ADMIN PORTAL</p>
                </div>

                <ul className="admin-nav">
                    <li><button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button></li>
                    <li><button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button></li>
                    <li><button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>Customers</button></li>
                    <li><button className={activeTab === 'atelier' ? 'active' : ''} onClick={() => setActiveTab('atelier')}>Atelier</button></li>
                </ul>

                <ul className="admin-sidebar-footer">
                    <li><button className="admin-back-btn" onClick={() => navigate('/shop/all')}>← Back to Store</button></li>
                    <li><button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button></li>
                </ul>
            </aside>

            <main className="admin-content">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'customers' && <CustomersTab />}
                {activeTab === 'atelier' && <AtelierTab />}
            </main>
        </div>
    )
}
export default AdminDashboard
