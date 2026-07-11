import { useState, useEffect } from 'react'
import RevenueCards from '../../component/admin/RevenueCards'
import RevenueChart from '../../component/admin/RevenueChart'
import OrdersChart from '../../component/admin/OrdersChart'
import StockOverview from '../../component/admin/StockOverview'
import StockChecking from '../../component/admin/StockChecking'
import TopSellingItems from '../../component/admin/TopSellingItems'
import CategorySplit from '../../component/admin/CategorySplit'
import RecentOrders from '../../component/admin/RecentOrders'

function OverviewTab() {
    const [overview, setOverview] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOverview = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/overview`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await res.json()
                setOverview(data)
            } catch (err) {
                console.error(err)
            }
            setLoading(false)
        }

        fetchOverview()
    }, [])

    if (loading) return <p>Loading...</p>
    if (!overview) return <p>Could not load overview data.</p>

    return (
        <div>
            <h1>Sales Overview</h1>

            <RevenueCards overview={overview} />
            <RevenueChart data={overview.revenueChart} />
            <OrdersChart data={overview.ordersChart} />
            <StockOverview stock={overview.stock} atelierPending={overview.atelierPending} />
            <StockChecking />
            <TopSellingItems items={overview.topSelling} />
            <CategorySplit data={overview.categorySplit} />
            <RecentOrders orders={overview.recentOrders} />
        </div>
    )
}
export default OverviewTab