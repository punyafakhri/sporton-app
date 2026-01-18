import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; 
import ProductDetail from './ProductDetail';
import CheckoutPage from './CheckoutPage';
import PaymentPage from './PaymentPage';
import PaymentStatusPage from './PaymentStatusPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-status" element={<PaymentStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;