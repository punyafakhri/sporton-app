import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getProducts, getCategories, getCart, addToCart, updateCartItem, removeFromCart } from './api/api';
import './App.css';

function Home() {
  const navigate = useNavigate();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch products dan categories paralel
      const [productsData, categoriesData, cartData] = await Promise.all([
        getProducts(),
        getCategories(),
        getCart()
      ]);

      setProducts(productsData.data || productsData);
      setCategories(categoriesData.data || categoriesData);
      setCartItems(cartData.data?.items || cartData.items || []);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      
      setProducts([
        {
          _id: '1',
          name: 'SportsOn HyperSoccer v2',
          category: { name: 'Football' },
          price: 458000,
          image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      
      // Refresh cart data
      const cartData = await getCart();
      setCartItems(cartData.data?.items || cartData.items || []);
      
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    
    try {
      await updateCartItem(productId, newQuantity);
      
      // Update local state
      setCartItems(items =>
        items.map(item =>
          item.productId._id === productId || item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      
      // Update local state
      setCartItems(items => items.filter(
        item => item.productId._id !== productId && item.productId !== productId
      ));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    }
  };

  // Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  // ProductCard Component 
  function ProductCard({ product }) {
    const productId = product._id || product.id;
    const categoryName = product.category?.name || product.category || 'Unknown';
    const imageUrl = product.image || product.imageUrl || 'https://via.placeholder.com/300';
    
    return (
      <div 
        className="product-card" 
        onClick={() => navigate(`/product/${productId}`)} 
        style={{ cursor: 'pointer' }}
      >
        <div className="product-thumb">
          <img src={imageUrl} alt={product.name} />
          <button 
            className="add-btn" 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(productId);
            }}
          >
            +
          </button>
        </div>
        <div className="product-info">
          <h4>{product.name}</h4>
          <p className="prod-cat">{categoryName}</p>
          <p className="prod-price">Rp. {product.price?.toLocaleString('id-ID')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '24px',
        fontWeight: '700'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '15px',
          textAlign: 'center',
          borderBottom: '2px solid #ffc107'
        }}>
          {error}
        </div>
      )}

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

      {/* CATEGORIES SECTION */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="section-header">
            <h2>SHOP BY CATEGORY</h2>
          </div>
          <div className="category-grid">
            {categories.slice(0, 6).map((category) => (
              <div key={category._id || category.id} className="category-card">
                {category.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT SECTION */}
      <section className="products-section">
        <h2 className="center-title">OUR PRODUCTS</h2>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No products available
            </p>
          )}
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
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                  <p style={{ fontSize: '16px' }}>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => {
                  const product = item.productId || item;
                  const productId = product._id || product.id;
                  
                  return (
                    <div key={productId} style={{
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
                        <img
                          src={product.image || product.imageUrl || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '8px'
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px' }}>
                          {product.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                          {product.category?.name || product.category}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: '#ff5722' }}>
                          Rp. {product.price?.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                      }}>
                        <button
                          onClick={() => removeItem(productId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '18px'
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
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            style={{
                              background: '#f0f0f0',
                              border: 'none',
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: '700' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            style={{
                              background: '#ff5722',
                              border: 'none',
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: 'white'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: '30px', borderTop: '2px solid #eee', background: '#fafafa' }}>
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

export default Home;