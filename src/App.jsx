import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { SettingsProvider } from '@/lib/SettingsContext';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/cartContext';
import Home from './pages/Home';
import UniversityPackage from './pages/UniversityPackage';
import SeniorJacket from './pages/SeniorJacket';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Policies from './pages/Policies';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Add page imports here

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <CartProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/university-package" element={<UniversityPackage />} />
                <Route path="/senior-jacket" element={<SeniorJacket />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/track-order" element={<OrderTracking />} />
                <Route path="/about" element={<About />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </CartProvider>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
