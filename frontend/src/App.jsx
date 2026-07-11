import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './component/Layout.jsx'
import Welcome from './pages/Welcome'
import CheckOut from './pages/CheckoutSuccess.jsx'
import ContactSupport from './pages/ContactSupport.jsx'
import MaisonAbout from './pages/MaisonAbout.jsx'
import MaisonConfigurator from './pages/MaisonConfigurator.jsx'
import MaisonLogin from './pages/MaisonLogin.jsx'
import MaisonRegister from './pages/MaisonRegister.jsx'
import MaisonSpecs from './pages/MaisonSpecs.jsx'
import Collection from './pages/Collection.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import { CartProvider } from './pages/CartContext.jsx'

import './App.css'


function App() {
  return (
    <CartProvider>
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Routes WITH Header/Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<MaisonRegister />} />
            <Route path="/login" element={<MaisonLogin />} />
            <Route path="/checkout-success" element={<CheckOut />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/contact" element={<ContactSupport />} />
            <Route path="/about" element={<MaisonAbout />} />
            <Route path="/configurator" element={<MaisonConfigurator />} />
            <Route path="/specs" element={<MaisonSpecs />} />
            <Route path="/shop/:category" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>

          {/* Routes WITHOUT Header/Footer */}
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
    </CartProvider>
  );
}
export default App