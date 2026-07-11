import { useState } from 'react'
import { useNavigate, Link} from 'react-router-dom';

function MaisonRegister() {
    const navigate = useNavigate()

    // Declare variables
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match.")
            return
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Registration failed.')
                return
            }

            setSubmitted(true)

            setTimeout(() => {
                navigate('/login')
            },  2000)

        } catch (err) {
            console.error(err)
            setError('Could not connect to server. Please try again.')
        }


    }

    return (
    <div className="auth-page">
        <div className="auth-card">
            <p className="auth-eyebrow">MAISON AURA</p>
            <h1 className="auth-title">An Invitation</h1>
            <p className="auth-subtitle">Welcome to the House</p>
            <div className="auth-divider" />
            <p className="auth-intro">Register to unlock private collection previews, seasonal lookbooks, and priority atelier scheduling.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <p className="auth-error">{error}</p>}
                {submitted && <p className="auth-success">Account successfully created! Redirecting to Login Page</p>}

                <div className="auth-field">
                    <label>Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe" required />
                </div>

                <div className="auth-field">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@email.com" required />
                </div>

                <div className="auth-field">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter a password" required />
                </div>

                <div className="auth-field">
                    <label>Confirm Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password" required />
                </div>

                <div className="auth-field">
                    <label>Phone Number</label>
                    <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+6512345678" required />
                </div>

                <button type="submit" className="auth-submit-btn">Request Entry</button>
            </form>

            <div className="auth-links">
                <p>Already have an account? <Link to="/login">Log in here</Link></p>
            </div>
        </div>
    </div>
    )
}
export default MaisonRegister
