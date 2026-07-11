import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from '../component/CartSidebar'

function Layout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <main className="app-main" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </>
  )
}
export default Layout