import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Data semua product
  const products = {
    1: {
      id: 1,
      name: 'SportsOn HyperSoccer v2',
      category: 'Football',
      price: 458000,
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
      description: 'The SportsOn HyperSoccer v2 is engineered for the player who demands precision, power, and unrivaled speed on the pitch. Crafted with cutting-edge materials for maximum performance and durability.'
    },
    2: {
      id: 2,
      name: 'ProRunner Elite X',
      category: 'Running',
      price: 520000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      description: 'Experience the ultimate running experience with ProRunner Elite X. Designed with advanced cushioning technology and lightweight materials to maximize your speed and comfort during long distance runs.'
    },
    3: {
      id: 3,
      name: 'Speed Trainer Pro',
      category: 'Training',
      price: 380000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      description: 'Perfect for intensive training sessions. The Speed Trainer Pro provides excellent support and stability for high-intensity workouts. Built with breathable mesh and responsive cushioning technology.'
    },
    4: {
      id: 4,
      name: 'Basketball Elite',
      category: 'Basketball',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
      description: 'Dominate the court with Basketball Elite shoes. Engineered with ankle support and excellent grip for quick cuts and jumps. Perfect for both competitive and recreational players.'
    }
  };

  // Ambil product data berdasarkan ID dari URL
  const product = products[id] || products[1];
  
  // State untuk Cart Popup
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: 1,
      image: product.image
    }
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="product-detail-page" style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <header className="header">
        <div className="logo">SPORTON</div>
        <nav className="nav">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>Category</span>
          <span>Explore Products</span>
        </nav>
        <div className="header-extra">
          <span>🔍</span>
          <span 
            className="cart-icon"
            onClick={() => setIsCartOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            🛒<small>{cartItems.length}</small>
          </span>
        </div>
      </header>

      {/* Tombol Back */}
      <button 
        onClick={() => navigate('/')} 
        className="btn-secondary" 
        style={{
          margin: '40px 8%', 
          color: 'black', 
          borderColor: 'black',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back to Home
      </button>

      {/* Container Detail Produk */}
      <div className="detail-container" style={{ 
        display: 'flex', 
        padding: '40px 8% 100px', 
        gap: '60px', 
        alignItems: 'center' 
      }}>
        {/* Gambar Produk */}
        <div className="detail-image" style={{ 
          flex: 1, 
          background: '#f5f5f5', 
          borderRadius: '25px',
          overflow: 'hidden'
        }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              padding: '40px',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Info Produk */}
        <div className="detail-info" style={{ flex: 1 }}>
          <p style={{ 
            color: '#ff5722', 
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '15px'
          }}>
            {product.category}
          </p>
          
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '950', 
            color: 'black',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            {product.name}
          </h1>
          
          <p style={{ 
            color: '#666', 
            lineHeight: '1.8', 
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            {product.description}
          </p>
          
          <h2 style={{ 
            color: '#ff5722', 
            fontSize: '36px', 
            fontWeight: '900',
            marginBottom: '40px'
          }}>
            Rp. {product.price.toLocaleString('id-ID')}
          </h2>
          
          {/* Tombol Action */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setIsCartOpen(true)}
              style={{ 
                flex: 1, 
                color: 'black', 
                borderColor: 'black',
                fontSize: '16px'
              }}
            >
              Add to Cart
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/checkout')}
              style={{ 
                flex: 1,
                fontSize: '16px'
              }}
            >
              Checkout Now →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-info">
            <h3 className="logo">SPORTON</h3>
            <p>Your trusted partner for premium sports equipment and apparel.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>SportsOn © 2025 All Rights Reserved.</p>
        </div>
      </footer>

      {/* CART POPUP */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 9999
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '450px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>
                Shopping Cart ({cartItems.length})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '20px',
                  padding: '15px',
                  background: '#f9f9f9',
                  borderRadius: '15px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <img src={item.image} alt={item.name} style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px'
                    }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                      {item.category}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#ff5722' }}>
                      Rp. {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}>
                      🗑️
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'white',
                      borderRadius: '8px',
                      padding: '5px'
                    }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{
                        background: '#f0f0f0',
                        border: 'none',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}>-</button>
                      <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: '700' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{
                        background: '#ff5722',
                        border: 'none',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: 'white'
                      }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: '30px', borderTop: '2px solid #eee', background: '#fafafa' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>Total</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#ff5722' }}>
                    Rp. {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  style={{
                    width: '100%',
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    padding: '18px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;