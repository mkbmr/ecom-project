import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from '../component/CartSidebar'

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <CartSidebar />
    </>
  )
}
export default Layout