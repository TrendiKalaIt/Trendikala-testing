// src/App.jsx
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layouts/Layout';
import AuthLayout from './components/Layouts/AuthLayout';
import HomeLayout from './components/Layouts/HomeLayout';

import ScrollToTop from './components/ScrollToTop';



import Home from './pages/Home';
import About from './pages/About';
import AllProducts from './pages/AllProducts';
import ProductDetailsPage from './components/productDetails/ProductDetailsPage';
import CartPage from './pages/CartPage';
import Wishlist from './pages/Wishlist';
import CheckoutDetails from './pages/Checkout';
import Thankyou from './pages/ThankyouPage';
import Manufacturing from './pages/Manufacturing'
import ErrorPage from './pages/ErrorPage'
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




// Redux imports
import { Provider } from 'react-redux'; // Import Provider
import store from './utility/store';
import ComingSoon from './components/ComingSoon';



function App() {
  return (
    <>
      <Toaster position="top-center" />
      {/* Wrap your entire application with the Redux Provider */}
      <Provider store={store}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/allproducts" element={<AllProducts />} />
              <Route path="/about" element={<About />} />
              <Route path="/manufacturing" element={<Manufacturing />} />
              <Route path="/productdetails/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<CheckoutDetails />} />
              <Route path="/thankyou" element={<Thankyou />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/cancellation-return" element={<ComingSoon title="Terms & Conditions" />} />
              <Route path="/privacy-policy" element={<ComingSoon title="Privacy Policy" />} />
              <Route path="/terms-conditions" element={<ComingSoon title="Cancellation & Return" />} />
              <Route path="/enquiry" element={<Enquiry/>}/>
              {/* add more routes here */}
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