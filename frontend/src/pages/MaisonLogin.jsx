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
            const res = await fetch('http://localhost:5000/api/login', {
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
    <div className="maison-login-page">
        <h1>Log in to Your Account</h1>
        <h5>Welcome back to Maison Aura</h5>

        <form onSubmit={handleSubmit}>
                {redirectMessage && <p style={{ color: 'orange' }}>{redirectMessage}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>
            Username:
            <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}     
            />
        </label>
        <br />

        <label>
            Password:
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </label>
        <br />

        <button type="submit">Log In</button>


        <h5>New to the House? <Link to="/register"> Register here</Link> </h5>
        <h5> <Link to="#">Forget Password?</Link> </h5>
        </form>
    </div>
    )
}
export default MaisonLogin