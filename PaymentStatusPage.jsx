import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); 

  const orderInfo = {
    orderId: '#ORD-2025-001234',
    date: 'January 18, 2026',
    total: 1523000,
    items: [
      { name: 'SportsOn HyperSoccer v2', qty: 1, price: 458000 },
      { name: 'ProRunner Elite X', qty: 2, price: 520000 }
    ],
    shipping: {
      name: 'John Doe',
      address: 'Jl. Merdeka No. 123',
      city: 'Jakarta',
      phone: '081234567890'
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '25px 8%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#000', margin: 0 }}>
          SPORTON
        </h1>
      </div>

      {/* Toggle Status */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={() => setStatus('pending')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            background: status === 'pending' ? '#ff9800' : '#e0e0e0',
            color: status === 'pending' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setStatus('success')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            background: status === 'success' ? '#4caf50' : '#e0e0e0',
            color: status === 'success' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Success
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 8% 80px', maxWidth: '900px', margin: '0 auto' }}>
        {status === 'pending' ? (
          // PENDING STATUS
          <div style={{
            background: 'white',
            padding: '50px',
            borderRadius: '25px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {/* Icon */}
            <div style={{
              width: '100px',
              height: '100px',
              background: '#fff3e0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px'
            }}>
              ⏳
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px', color: '#ff9800' }}>
              Payment Pending
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.8',
              maxWidth: '500px',
              margin: '0 auto 30px'
            }}>
              We have received your payment proof and it's currently being verified by our team. 
              This usually takes 1-24 hours.
            </p>

            {/* Order Details */}
            <div style={{
              background: '#fafafa',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'left',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Order Details
              </h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                <span style={{ color: '#666' }}>Order ID</span>
                <span style={{ fontWeight: '700', color: '#000' }}>{orderInfo.orderId}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                <span style={{ color: '#666' }}>Date</span>
                <span style={{ fontWeight: '600' }}>{orderInfo.date}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '15px',
                borderTop: '2px solid #e0e0e0',
                marginTop: '15px'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Total Amount</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#ff9800' }}>
                  Rp. {orderInfo.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div style={{
              background: '#fff3e0',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '1px solid #ffe0b2'
            }}>
              <p style={{ fontSize: '14px', color: '#e65100', margin: 0, fontWeight: '600' }}>
                💡 You will receive an email confirmation once your payment is verified.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          // SUCCESS STATUS
          <div style={{
            background: 'white',
            padding: '50px',
            borderRadius: '25px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {/* Icon */}
            <div style={{
              width: '100px',
              height: '100px',
              background: '#e8f5e9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px'
            }}>
              ✅
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px', color: '#4caf50' }}>
              Payment Successful!
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.8',
              maxWidth: '500px',
              margin: '0 auto 30px'
            }}>
              Thank you for your purchase! Your order has been confirmed and will be 
              processed shortly.
            </p>

            {/* Order Summary */}
            <div style={{
              background: '#fafafa',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'left',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Order Summary
              </h3>

              {/* Order Info */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Order ID</span>
                  <span style={{ fontWeight: '700', color: '#000' }}>{orderInfo.orderId}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Date</span>
                  <span style={{ fontWeight: '600' }}>{orderInfo.date}</span>
                </div>
              </div>

              {/* Items */}
              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '15px',
                marginBottom: '15px'
              }}>
                {orderInfo.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#666' }}>
                      {item.name} (x{item.qty})
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      Rp. {(item.price * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '15px',
                marginBottom: '15px'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#000' }}>
                  Shipping Address
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                  {orderInfo.shipping.name}
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                  {orderInfo.shipping.address}
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                  {orderInfo.shipping.city}
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                  {orderInfo.shipping.phone}
                </p>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '15px',
                borderTop: '2px solid #e0e0e0'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Total Paid</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#4caf50' }}>
                  Rp. {orderInfo.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Success Message */}
            <div style={{
              background: '#e8f5e9',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '1px solid #c8e6c9'
            }}>
              <p style={{ fontSize: '14px', color: '#2e7d32', margin: 0, fontWeight: '600' }}>
                📧 Order confirmation has been sent to your email!
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => alert('Track order feature coming soon!')}
                style={{
                  background: 'transparent',
                  border: '2px solid #4caf50',
                  color: '#4caf50',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Track Order
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentStatusPage;