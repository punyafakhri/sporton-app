import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getCart, addToCart, updateCartItem, removeFromCart } from './api/api';
import './App.css';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch product detail
  useEffect(() => {
    fetchProductDetail();
    fetchCartData();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data.data || data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
      
      // Fallback data
      setProduct({
        _id: id,
        name: 'Product Not Found',
        category: { name: 'Unknown' },
        price: 0,
        image: 'https://via.placeholder.com/300',
        description: 'Product details could not be loaded.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      const cartData = await getCart();
      setCartItems(cartData.data?.items || cartData.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id || product.id, 1);
      await fetchCartData();
      setIsCartOpen(true);
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(productId, newQuantity);
      setCartItems(items =>
        items.map(item =>
          (item.productId._id === productId || item.productId === productId)
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(items => items.filter(
        item => item.productId._id !== productId && item.productId !== productId
      ));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

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
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: '20px'
      }}>
        <h2>Product Not Found</h2>
        <button 
          className="btn-primary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const categoryName = product.category?.name || product.category || 'Unknown';
  const imageUrl = product.image || product.imageUrl || 'https://via.placeholder.com/300';

  return (
    <div className="product-detail-page" style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '15px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

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

      {/* Back Button */}
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

      {/* Product Detail Container */}
      <div className="detail-container" style={{ 
        display: 'flex', 
        padding: '40px 8% 100px', 
        gap: '60px', 
        alignItems: 'center' 
      }}>
        {/* Product Image */}
        <div className="detail-image" style={{ 
          flex: 1, 
          background: '#f5f5f5', 
          borderRadius: '25px',
          overflow: 'hidden'
        }}>
          <img 
            src={imageUrl} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              padding: '40px',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Product Info */}
        <div className="detail-info" style={{ flex: 1 }}>
          <p style={{ 
            color: '#ff5722', 
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '15px'
          }}>
            {categoryName}
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
            {product.description || 'No description available.'}
          </p>
          
          <h2 style={{ 
            color: '#ff5722', 
            fontSize: '36px', 
            fontWeight: '900',
            marginBottom: '40px'
          }}>
            Rp. {product.price?.toLocaleString('id-ID') || '0'}
          </h2>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              className="btn-secondary" 
              onClick={handleAddToCart}
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
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                  <p style={{ fontSize: '16px' }}>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => {
                  const prod = item.productId || item;
                  const productId = prod._id || prod.id;
                  
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
                          src={prod.image || prod.imageUrl}
                          alt={prod.name}
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
                          {prod.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                          {prod.category?.name || prod.category}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: '#ff5722' }}>
                          Rp. {prod.price?.toLocaleString('id-ID')}
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

export default ProductDetail;