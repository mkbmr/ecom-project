import { useState} from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

function MaisonLogin() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectMessage = searchParams.get('message')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    // Backend API here
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed.' )
                return
            }

            console.log('Logged in as:', data)

            // after successful login, in MaisonLogin.jsx
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('token', data.token)

            if (data.role === 'admin') {
                navigate('/dashboard')
            } else {
                navigate('/shop/all')
            }

        } catch (err) {
            console.error(err)
            setError('Could not connect to server. Please try again.')
        }
    }

    return (
    <div className="auth-page">
        <div className="auth-card">
            <p className="auth-eyebrow">MAISON AURA</p>
            <h1 className="auth-title">Log In</h1>
            <p className="auth-subtitle">Welcome back to Maison Aura</p>
            <div className="auth-divider" />

            <form className="auth-form" onSubmit={handleSubmit}>
                {redirectMessage && <p className="auth-notice">{redirectMessage}</p>}
                {error && <p className="auth-error">{error}</p>}

                <div className="auth-field">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="auth-submit-btn">Log In</button>
            </form>

            <div className="auth-links">
                <p>New to the House? <Link to="/register">Register here</Link></p>
                <p><Link to="#">Forgot Password?</Link></p>
            </div>
        </div>
    </div>
    )
}
export default MaisonLogin
