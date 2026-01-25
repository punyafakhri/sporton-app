import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }
    
    setAdminUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    {
      path: '/admin/products',
      icon: '📦',
      label: 'Products',
      description: 'Manage Products'
    },
    {
      path: '/admin/categories',
      icon: '🏷️',
      label: 'Categories',
      description: 'Manage Categories'
    },
    {
      path: '/admin/banks',
      icon: '🏦',
      label: 'Banks',
      description: 'Manage Banks'
    },
    {
      path: '/admin/transactions',
      icon: '💳',
      label: 'Transactions',
      description: 'Manage Transactions'
    }
  ];

  if (!adminUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '20px',
        fontWeight: '700'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f7fa'
    }}>
      {/* Sidebar */}
      <div style={{
        width: isSidebarCollapsed ? '80px' : '280px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div style={{
          padding: '30px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between'
        }}>
          {!isSidebarCollapsed && (
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                SPORTON
              </div>
              <div style={{
                fontSize: '11px',
                color: '#888',
                marginTop: '4px',
                letterSpacing: '2px'
              }}>
                ADMIN PANEL
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{
          flex: 1,
          padding: '20px 0',
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: isSidebarCollapsed ? '16px 20px' : '16px 24px',
                  margin: '6px 12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(255, 87, 34, 0.2)' : 'transparent',
                  borderLeft: isActive ? '4px solid #ff5722' : '4px solid transparent',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                {!isSidebarCollapsed && (
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: isActive ? '#ff5722' : 'white',
                      marginBottom: '2px'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#888'
                    }}>
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {!isSidebarCollapsed && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {adminUser.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#888'
              }}>
                {adminUser.email}
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: isSidebarCollapsed ? '12px' : '12px 16px',
              background: 'rgba(255, 87, 34, 0.2)',
              border: '1px solid #ff5722',
              color: '#ff5722',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ff5722';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 87, 34, 0.2)';
              e.target.style.color = '#ff5722';
            }}
          >
            <span>🚪</span>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        transition: 'all 0.3s'
      }}>
        {/* Top Bar */}
        <div style={{
          background: 'white',
          padding: '20px 40px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#1a1a1a',
              margin: 0
            }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '4px 0 0 0'
            }}>
              {menuItems.find(item => item.path === location.pathname)?.description || ''}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '2px solid #1a1a1a',
              color: '#1a1a1a',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#1a1a1a';
            }}
          >
            <span>🏠</span>
            <span>Visit Site</span>
          </button>
        </div>

        {/* Page Content */}
        <div style={{
          padding: '40px'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;