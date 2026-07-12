import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function AtelierTab() {
    const [appointments, setAppointments] = useState([])
    const [appointmentsLoading, setAppointmentsLoading] = useState(true)
    const [appointmentsError, setAppointmentsError] = useState('')
    const [managingId, setManagingId] = useState(null)
    const [manageForm, setManageForm] = useState({ status: '', admin_message: '' })

    // Callers that refetch after a mutation reset loading/error themselves —
    // setState here would run synchronously inside the mount effect
    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_URL}/api/atelier`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json()

            if (!res.ok) {
                setAppointmentsError(data.error || 'Could not load fitting requests.')
                setAppointments([])
                setAppointmentsLoading(false)
                return
            }

            setAppointments(data)
        } catch (err) {
            console.error(err)
            setAppointmentsError('Could not connect to server.')
        }
        setAppointmentsLoading(false)
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const handleManageClick = (appointment) => {
        setManagingId(appointment.id)
        setManageForm({
            status: appointment.status,
            admin_message: appointment.admin_message || ''
        })
    }

    const handleManageSubmit = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/atelier/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(manageForm)
            })

            if (!res.ok) {
                alert('Failed to update appointment.')
                return
            }

            setManagingId(null)
            setAppointmentsLoading(true)
            setAppointmentsError('')
            fetchAppointments()
        } catch (err) {
            console.error(err)
            alert('Could not connect to server.')
        }
    }

    return (
        <div>
            <h1 className="admin-page-title" style={{ marginBottom: '1.5rem' }}>Private Atelier Fittings ({appointments.length})</h1>

            {/* Stat cards */}
            <div className="atelier-stats">
                {['pending', 'contacted', 'scheduled', 'completed'].map(status => (
                    <div key={status} className="atelier-stat-card">
                        <p className="atelier-stat-label">{status}</p>
                        <div className={`atelier-stat-bar atelier-stat-bar--${status}`} />
                        <p className={`atelier-stat-count atelier-stat-count--${status}`}>
                            {appointments.filter(a => a.status === status).length}
                        </p>
                        <p className="atelier-stat-requests">requests</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="admin-card">
            {appointmentsLoading ? (
                <p>Loading...</p>
            ) : appointmentsError ? (
                <p style={{ color: '#ef4444' }}>{appointmentsError}</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>CUSTOMER</th>
                            <th>CONTACT</th>
                            <th>PRODUCT</th>
                            <th>CUT / COLOR</th>
                            <th>ORDER DATE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => (
                            <>
                                <tr key={a.id}>
                                    <td className="atelier-customer-name">{a.full_name}</td>
                                    <td>
                                        <div className="atelier-contact-email">{a.email}</div>
                                        <div>{a.phone}</div>
                                    </td>
                                    <td className="atelier-cell-center">{a.product_name}</td>
                                    <td className="atelier-cell-center">
                                        <div>{a.cut}</div>
                                        <div className="atelier-color-muted">{a.color}</div>
                                    </td>
                                    <td>
                                        {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <span className={`atelier-status-badge atelier-status-badge--${a.status}`}>
                                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="row-action-btn" onClick={() => handleManageClick(a)}>Manage</button>
                                        </div>
                                    </td>
                                </tr>

                                {managingId === a.id && (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="admin-subpanel">
                                                <h4>Manage Appointment — {a.full_name}</h4>

                                                <label>Status:
                                                    <select
                                                        value={manageForm.status}
                                                        onChange={(e) => setManageForm({ ...manageForm, status: e.target.value })}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="scheduled">Scheduled</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </label>

                                                <br /><br />

                                                <label>Status Message:
                                                    <textarea
                                                        className="atelier-manage-textarea"
                                                        value={manageForm.admin_message}
                                                        onChange={(e) => setManageForm({ ...manageForm, admin_message: e.target.value })}
                                                        placeholder="Add a note or message for this appointment..."
                                                        rows={3}
                                                    />
                                                </label>

                                                <br />

                                                <button className="admin-plain-btn admin-plain-btn--primary" onClick={() => handleManageSubmit(a.id)}>Save Changes</button>
                                                <button className="admin-plain-btn atelier-cancel-btn" onClick={() => setManagingId(null)}>Cancel</button>
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
        </div>
    )
}
export default AtelierTab
