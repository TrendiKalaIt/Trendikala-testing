// src/App.jsx
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layouts/Layout';
import AuthLayout from './components/Layouts/AuthLayout';
import HomeLayout from './components/Layouts/HomeLayout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import AllProducts from './pages/AllProducts';
import ProductDetailsPage from './components/productDetails/ProductDetailsPage';
import CartPage from './pages/CartPage';
import Wishlist from './pages/Wishlist';
import CheckoutDetails from './pages/Checkout';
import Thankyou from './pages/ThankyouPage';
import Manufacturing from './pages/Manufacturing';
import ErrorPage from './pages/ErrorPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from './pages/OTPVerification';
import SearchResults from './pages/SearchResults';
import FAQPage from './pages/FAQPage';
import ContactUs from './pages/ContactUs';
import MyOrdersPage from './pages/MyOrdersPage';
import Enquiry from './components/EnquiryForm';
// import CancellationReturn from './pages/CancellationReturn';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import TermsConditions from './pages/TermsConditions';
import ComingSoon from './components/ComingSoon';
import UserProfilePage from "./pages/UserProfilePage";
import CategoryProducts from './pages/CategoryProducts';

// Redux
import { Provider } from 'react-redux';
import store from './utility/store';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Provider store={store}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/allproducts" element={<AllProducts />} />
              <Route path="/about" element={<About />} />
              <Route path="/manufacturing" element={<Manufacturing />} />
              <Route path="/productdetails/:id" element={<ProductDetailsPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/cancellation-return" element={<ComingSoon title="Cancellation & Return" />} />
              <Route path="/privacy-policy" element={<ComingSoon title="Privacy Policy" />} />
              <Route path="/terms-conditions" element={<ComingSoon title=" Terms & Conditions" />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/checkout" element={<CheckoutDetails />} />
              <Route path="/thankyou" element={<Thankyou />} />
              <Route path="/category/:categoryId" element={<CategoryProducts />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>
            </Route>

            <Route element={<HomeLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;