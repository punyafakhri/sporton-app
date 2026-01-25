import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; 
import ProductDetail from './ProductDetail';
import CheckoutPage from './CheckoutPage';
import PaymentPage from './PaymentPage';
import PaymentStatusPage from './PaymentStatusPage';

// Admin Pages
import LoginPage from './LoginPage';
import AdminLayout from './admin/AdminLayout';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import BankManagement from './BankManagement';
import TransactionManagement from './TransactionManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-status" element={<PaymentStatusPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="banks" element={<BankManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;