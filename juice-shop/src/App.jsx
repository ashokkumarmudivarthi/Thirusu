import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  )
}

export default App