import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulasi login (nanti akan diganti dengan API call)
      // Demo credentials: admin@sporton.com / admin123
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email === 'admin@sporton.com' && formData.password === 'admin123') {
        localStorage.setItem('adminToken', 'demo-admin-token-12345');
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          name: 'Admin User',
          role: 'admin'
        }));
        
        navigate('/admin/products');
      } else {
        setErrors({
          general: 'Invalid email or password'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({
        general: 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 80px',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '900',
          marginBottom: '20px',
          letterSpacing: '2px'
        }}>
          SPORTON
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '300',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Admin Panel
        </div>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          opacity: 0.9,
          maxWidth: '500px'
        }}>
          Manage your products, categories, transactions, and bank information all in one place.
          Login to access the admin dashboard.
        </p>
        
        {/* Demo Credentials Info */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
            🔐 Demo Credentials
          </p>
          <p style={{ fontSize: '13px', marginBottom: '5px', opacity: 0.9 }}>
            Email: <strong>admin@sporton.com</strong>
          </p>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>
            Password: <strong>admin123</strong>
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'white',
          padding: '50px 40px',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '450px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '900',
            marginBottom: '10px',
            color: '#1a1a1a'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '40px',
            fontSize: '15px'
          }}>
            Login to your admin account
          </p>

          {/* General Error */}
          {errors.general && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2'
            }}>
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@sporton.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: errors.email ? '2px solid #f44336' : '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!errors.email) e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  if (!errors.email) e.target.style.borderColor = '#e5e5e5';
                }}
              />
              {errors.email && (
                <p style={{
                  color: '#f44336',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginLeft: '4px'
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 16px',
                    border: errors.password ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.borderColor = '#667eea';
                  }}
                  onBlur={(e) => {
                    if (!errors.password) e.target.style.borderColor = '#e5e5e5';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '5px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  color: '#f44336',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginLeft: '4px'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  style={{
                    marginRight: '8px',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Forgot password feature coming soon!');
                }}
                style={{
                  color: '#667eea',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Back to Home */}
          <div style={{
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;