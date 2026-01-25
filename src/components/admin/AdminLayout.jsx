import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>SPORTON</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '✕' : '≡'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <a 
            href="/admin/products" 
            className={`nav-item ${isActive('/admin/products')}`}
            onClick={() => navigate('/admin/products')}
          >
            📦 Products
          </a>
          <a 
            href="/admin/categories" 
            className={`nav-item ${isActive('/admin/categories')}`}
            onClick={() => navigate('/admin/categories')}
          >
            📁 Categories
          </a>
          <a 
            href="/admin/banks" 
            className={`nav-item ${isActive('/admin/banks')}`}
            onClick={() => navigate('/admin/banks')}
          >
            🏦 Banks
          </a>
          <a 
            href="/admin/transactions" 
            className={`nav-item ${isActive('/admin/transactions')}`}
            onClick={() => navigate('/admin/transactions')}
          >
            💳 Transactions
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {adminUser.name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">{adminUser.name || 'Admin'}</p>
              <p className="user-role">{adminUser.role || 'Administrator'}</p>
            </div>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ≡
          </button>
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <button className="profile-btn">{adminUser.name?.charAt(0) || 'A'}</button>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;