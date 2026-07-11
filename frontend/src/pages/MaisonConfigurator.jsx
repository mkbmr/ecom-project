import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function MaisonConfigurator() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ productName: '', cut: '', color: '', notes: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login?message=Please create an account to request a private atelier fitting.')
        }
    }, [navigate])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const res = await fetch(`${API_URL}/api/atelier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Could not submit your fitting request.')
                setSubmitting(false)
                return
            }

            setSubmitted(true)
        } catch (err) {
            console.error(err)
            setError('Could not connect to server.')
        }
        setSubmitting(false)
    }

    return (
        <div className="configurator-page">
            <div className="configurator-hero">
                <p className="configurator-eyebrow">Members Only</p>
                <h1 className="configurator-headline">Private Atelier Fitting</h1>
                <p className="configurator-subtitle">
                    Request a bespoke fitting with our atelier. Tell us about the piece
                    you have in mind and our team will reach out to schedule your session.
                </p>
            </div>

            {submitted ? (
                <p className="configurator-status">
                    Your fitting request has been received. Our concierge team will contact
                    you shortly to confirm your appointment.
                </p>
            ) : (
                <form className="configurator-form" onSubmit={handleSubmit}>
                    <label>
                        Product / Garment
                        <input
                            type="text"
                            name="productName"
                            value={form.productName}
                            onChange={handleChange}
                            placeholder="e.g. Tailored Wool Blazer"
                        />
                    </label>

                    <label>
                        Cut
                        <input
                            type="text"
                            name="cut"
                            value={form.cut}
                            onChange={handleChange}
                            placeholder="e.g. Slim Fit"
                        />
                    </label>

                    <label>
                        Color
                        <input
                            type="text"
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            placeholder="e.g. Charcoal"
                        />
                    </label>

                    <label>
                        Notes
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Preferred dates, sizing notes, or any other requests"
                        />
                    </label>

                    {error && <p className="configurator-error">{error}</p>}

                    <button className="btn-return" type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Request Fitting'}
                    </button>
                </form>
            )}
        </div>
    )
}
export default MaisonConfigurator
