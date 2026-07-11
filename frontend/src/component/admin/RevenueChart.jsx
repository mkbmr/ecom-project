import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function RevenueChart({ data }) {
    return (
        <div className="admin-card">
            <h3>Revenue — Last 30 Days</h3>
            <p style={{ color: '#888', fontSize: '13px' }}>Daily revenue trend</p>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                        labelFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
export default RevenueChart