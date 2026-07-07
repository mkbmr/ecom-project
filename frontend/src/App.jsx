import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Welcome from './pages/Welcome'
import Header from './component/Header'
import Footer from './component/Footer.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CheckOut from './pages/CheckoutSuccess.jsx'
import ContactSupport from './pages/ContactSupport.jsx'
import About from './pages/MaisonAbout.jsx'
import MaisonConfigurator from './pages/MaisonConfigurator.jsx'
import MaisonAbout from './pages/MaisonAbout.jsx'
import MaisonLogin from './pages/MaisonLogin.jsx'
import MaisonRegister from './pages/MaisonRegister.jsx'
import MaisonSpecs from './pages/MaisonSpecs.jsx'
import Collection from './pages/Collection.jsx'

import './App.css'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />        
          <Route path="/register" element={<MaisonRegister />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/checkout-success" element={<CheckOut />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/about" element={<MaisonAbout />} />
          <Route path="/configurator" element={<MaisonConfigurator/>} />
          <Route path="/login" element={<MaisonLogin />} />          
          <Route path="/register" element={<MaisonRegister />} />          
          <Route path="/specs" element={<MaisonSpecs />} />
          <Route path="/shop/:category" element={<Collection />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
export default App