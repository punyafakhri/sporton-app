import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createTransaction } from './api/api';

function CheckoutPage() {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      const items = cartData.data?.items || cartData.items || [];
      
      if (items.length === 0) {
        alert('Your cart is empty!');
        navigate('/');
        return;
      }
      
      setCartItems(items);
    } catch (err) {
      console.error('Error fetching cart:', err);
      alert('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const shippingCost = 25000;
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validasi form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields!');
      return;
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    try {
      // Prepare transaction data
      const transactionData = {
        items: cartItems.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.productId?.price || item.price
        })),
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        },
        notes: formData.notes,
        subtotal: subtotal,
        shippingCost: shippingCost,
        totalAmount: total
      };

      console.log('Creating transaction:', transactionData);
      
      const response = await createTransaction(transactionData);
      const transactionId = response.data?._id || response._id;
      
      console.log('Transaction created:', transactionId);
      
      // Simpan transaction ID ke localStorage untuk digunakan di payment page
      localStorage.setItem('currentTransactionId', transactionId);
      localStorage.setItem('checkoutData', JSON.stringify(formData));
      
      // Navigate to payment page
      navigate('/payment');
    } catch (err) {
      console.error('Error creating transaction:', err);
      alert('Failed to create transaction. Please try again.');
    }
  };

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
        Loading checkout...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '25px 8%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#000', margin: 0 }}>
          SPORTON
        </h1>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: '2px solid #000',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '0 8% 80px',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Side - Form */}
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px', color: '#000' }}>
            Checkout
          </h2>

          {/* Contact Information */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', color: '#000' }}>
              Contact Information
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                placeholder="Enter your full name"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', color: '#000' }}>
              Shipping Address
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                placeholder="Street address, building, etc."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  placeholder="City"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                  Province *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  placeholder="Province"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  placeholder="12345"
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                placeholder="Any special requests?"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '25px', color: '#000' }}>
              Order Summary
            </h3>

            {/* Cart Items */}
            <div style={{ marginBottom: '25px' }}>
              {cartItems.map(item => {
                const product = item.productId || item;
                const itemId = product._id || product.id || item.id;
                
                return (
                  <div key={itemId} style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: '#f5f5f5',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img src={product.image || product.imageUrl} alt={product.name} style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px'
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px' }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                        {product.category?.name || product.category} × {item.quantity}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: '800', color: '#ff5722' }}>
                        Rp. {((product.price || 0) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '15px'
              }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>Rp. {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '15px'
              }}>
                <span style={{ color: '#666' }}>Shipping</span>
                <span style={{ fontWeight: '600' }}>Rp. {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div style={{
                borderTop: '2px solid #f0f0f0',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#ff5722' }}>
                  Rp. {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
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
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;