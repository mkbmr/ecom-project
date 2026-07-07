import { useState, useSyncExternalStore} from 'react'
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

    const handleSubmit = (e) => {
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

        
        console.log('Registering with:', formData)
        setSubmitted(true)

        setTimeout(() => {
            navigate('/login')
        },  2000)
    } 

    return (
    <div className="maison-register-page">
        <h1>An invitation</h1>
        <h5>Welcome to the House</h5>
        <p>Register to unlock private collection previews, seasonal lookbooks, and priority atelier scheduling.</p>

        <form onSubmit={handleSubmit}>

        <label>
            Full Name:
            <input 
            name="fullName" 
            className="lux-input" 
            type="text" 
            value={formData.fullName} 
            onChange={handleChange} 
            placeholder="John Doe" required />
        </label>
        <br />

        <label>
            Email:
            <input 
            name="email" 
            className="lux-input" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="name@email.com" required />
        </label>
        <br />

        <label>
            Password:
            <input 
            name="password" 
            className="lux-input" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Enter a password" required />
        </label>
        <br />

        <label>
            Confirm Password:
            <input 
            name="confirmPassword" 
            className="lux-input" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            placeholder="Confirm password" required />
        </label>

        <br />

        <label>
            Phone Number:
            <input 
            name="phone" 
            className="lux-input" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+6512345678" required />
        </label>
        <br />

        <button 
        type="submit" 
        className="maison-login-btn">Request Entry</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {submitted && <p style={{ color: 'black' }}>{"Account successfully created! Redirecting to Login Page"}</p>}
        </form>
    </div>
    )
}
export default MaisonRegister