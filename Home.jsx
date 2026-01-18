import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './App.css';

function Home() {
  const navigate = useNavigate();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'SportsOn HyperSoccer v2',
      category: 'Football',
      price: 458000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088'
    },
    {
      id: 2,
      name: 'ProRunner Elite X',
      category: 'Running',
      price: 520000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    }
  ]);

  // update quantity
  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // delete item
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Hitung total
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ProductCard Component 
  function ProductCard({ id, img, name, category, price }) {
    return (
      <div 
        className="product-card" 
        onClick={() => navigate(`/product/${id}`)} 
        style={{ cursor: 'pointer' }}
      >
        <div className="product-thumb">
          <img src={img} alt={name} />
          <button className="add-btn" onClick={(e) => e.stopPropagation()}>+</button>
        </div>
        <div className="product-info">
          <h4>{name}</h4>
          <p className="prod-cat">{category}</p>
          <p className="prod-price">{price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* HEADER */}
      <header className="header">
        <div className="logo">SPORTON</div>
        <nav className="nav">
          <span className="active">Home</span>
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

      {/* HERO SECTION */}
      <main className="hero">
        <div className="hero-content">
          <p className="sale-tag">Friday Sale 50%</p>
          <h1>WEAR YOUR <br /> TOP-QUALITY <br /> SPORTSWEAR</h1>
          <p className="description">
            Engineered for endurance and designed for speed. Experience gear 
            that moves as fast as you do.
          </p>
          <div className="cta-container">
            <button className="btn-primary">Explore More</button>
            <button className="btn-secondary">Watch Video</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Hero Shoes" />
        </div>
      </main>

      {/* PRODUCT SECTION */}
      <section className="products-section">
        <h2 className="center-title">OUR PRODUCTS</h2>
        <div className="product-grid">
          <ProductCard 
            id={1}
            img="https://images.unsplash.com/photo-1543353071-873f17a7a088"
            name="SportsOn HyperSoccer v2" 
            category="Football" 
            price="Rp. 458.000" 
          />
          <ProductCard 
            id={2}
            img="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            name="ProRunner Elite X" 
            category="Running" 
            price="Rp. 520.000" 
          />
          <ProductCard 
            id={3}
            img="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
            name="Speed Trainer Pro" 
            category="Training" 
            price="Rp. 380.000" 
          />
          <ProductCard 
            id={4}
            img="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
            name="Basketball Elite" 
            category="Basketball" 
            price="Rp. 650.000" 
          />
        </div>
      </section>

      {/* FOOTER */}
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
          {/* Cart Panel */}
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
            {/* Header */}
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
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 30px'
            }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                  <p style={{ fontSize: '16px' }}>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '20px',
                      padding: '15px',
                      background: '#f9f9f9',
                      borderRadius: '15px'
                    }}
                  >
                    {/* Product Image */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '8px'
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        marginBottom: '5px',
                        color: '#333'
                      }}>
                        {item.name}
                      </h4>
                      <p style={{
                        fontSize: '13px',
                        color: '#888',
                        marginBottom: '10px'
                      }}>
                        {item.category}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#ff5722'
                      }}>
                        Rp. {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end'
                    }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#999',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0'
                        }}
                      >
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
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            background: '#f0f0f0',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#666'
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          minWidth: '25px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            background: '#ff5722',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'white'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer - Total & Checkout */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '30px',
                borderTop: '2px solid #eee',
                background: '#fafafa'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>
                    Total
                  </span>
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
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
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

export default Home;