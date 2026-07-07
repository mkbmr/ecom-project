import { useState} from 'react'
import { Link } from 'react-router-dom'

function MaisonLogin() {
    // Declalre variables
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // Backend API here
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Logging in with:', username, password)
    }

    return (
    <div className="maison-login-page">
        <h1>Log in to Your Account</h1>
        <h5>Welcome back to Maison Aura</h5>

        <form onSubmit={handleSubmit}>
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