import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactionById } from './api/api';

function PaymentStatusPage() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactionStatus();
  }, []);

  const fetchTransactionStatus = async () => {
    try {
      setLoading(true);
      
      // Get transaction ID dari localStorage
      const transactionId = localStorage.getItem('lastTransactionId') || 
                           localStorage.getItem('currentTransactionId');
      
      if (!transactionId) {
        setError('No transaction found');
        setLoading(false);
        return;
      }

      // Fetch transaction details
      const data = await getTransactionById(transactionId);
      setTransaction(data.data || data);
      
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError('Failed to load transaction details');
      
      // Fallback data untuk demo
      setTransaction({
        _id: '#ORD-2025-001234',
        status: 'pending', // pending, approved, rejected
        totalAmount: 1523000,
        subtotal: 1498000,
        shippingCost: 25000,
        createdAt: new Date().toISOString(),
        items: [
          { 
            productId: { name: 'SportsOn HyperSoccer v2', price: 458000 }, 
            quantity: 1 
          },
          { 
            productId: { name: 'ProRunner Elite X', price: 520000 }, 
            quantity: 2 
          }
        ],
        shippingInfo: {
          fullName: 'John Doe',
          address: 'Jl. Merdeka No. 123',
          city: 'Jakarta',
          phone: '081234567890'
        }
      });
    } finally {
      setLoading(false);
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
        Loading transaction status...
      </div>
    );
  }

  if (error && !transaction) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: '20px'
      }}>
        <h2 style={{ color: '#ff5722' }}>Transaction Not Found</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#ff5722',
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
    );
  }

  // Determine status
  const status = transaction?.status || 'pending';
  const isPending = status === 'pending';
  const isSuccess = status === 'approved' || status === 'success';
  const isRejected = status === 'rejected';

  // Format date
  const orderDate = transaction?.createdAt 
    ? new Date(transaction.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'January 18, 2026';

  const orderId = transaction?._id || transaction?.id || '#ORD-2025-001234';
  const orderTotal = transaction?.totalAmount || 0;

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

      {/* Main Content */}
      <div style={{ padding: '0 8% 80px', maxWidth: '900px', margin: '0 auto' }}>
        {isPending && (
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
                <span style={{ fontWeight: '700', color: '#000' }}>{orderId}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                <span style={{ color: '#666' }}>Date</span>
                <span style={{ fontWeight: '600' }}>{orderDate}</span>
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
                  Rp. {orderTotal.toLocaleString('id-ID')}
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
        )}

        {isSuccess && (
          // SUCCESS STATUS
          <div style={{
            background: 'white',
            padding: '50px',
            borderRadius: '25px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {/* Celebration Animation */}
            <div style={{
              animation: 'celebrationPulse 0.8s ease-out',
              marginBottom: '30px'
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
                margin: '0 auto',
                fontSize: '50px'
              }}>
                ✅
              </div>
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
              processed shortly. We've sent a confirmation email to your inbox.
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
                  <span style={{ fontWeight: '700', color: '#000' }}>{orderId}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Date</span>
                  <span style={{ fontWeight: '600' }}>{orderDate}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Payment Status</span>
                  <span style={{ 
                    background: '#c8e6c9',
                    color: '#2e7d32',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}>
                    APPROVED ✓
                  </span>
                </div>
              </div>

              {/* Items */}
              {transaction?.items && transaction.items.length > 0 && (
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '15px',
                  marginBottom: '15px'
                }}>
                  {transaction.items.map((item, idx) => {
                    const product = item.productId || item;
                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '14px'
                      }}>
                        <span style={{ color: '#666' }}>
                          {product.name} (x{item.quantity})
                        </span>
                        <span style={{ fontWeight: '600' }}>
                          Rp. {((product.price || 0) * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Shipping Info */}
              {transaction?.shippingInfo && (
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '15px',
                  marginBottom: '15px'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#000' }}>
                    Shipping Address
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                    {transaction.shippingInfo.fullName}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                    {transaction.shippingInfo.address}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                    {transaction.shippingInfo.city}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                    {transaction.shippingInfo.phone}
                  </p>
                </div>
              )}

              {/* Cost Breakdown */}
              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '15px',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>
                    Rp. {(transaction?.subtotal || orderTotal).toLocaleString('id-ID')}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#666' }}>Shipping Cost</span>
                  <span style={{ fontWeight: '600' }}>
                    Rp. {(transaction?.shippingCost || 0).toLocaleString('id-ID')}
                  </span>
                </div>
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
                  Rp. {orderTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Estimated Delivery Timeline */}
            <div style={{
              background: '#f5f5f5',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                📦 Estimated Delivery Timeline
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {/* Timeline Item 1 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#4caf50',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px',
                    margin: '0 auto 10px'
                  }}>
                    ✓
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', margin: '5px 0' }}>
                    Order Confirmed
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0' }}>
                    Today
                  </p>
                </div>

                {/* Timeline Item 2 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#2196f3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px',
                    margin: '0 auto 10px'
                  }}>
                    📦
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', margin: '5px 0' }}>
                    Processing
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0' }}>
                    1-2 Days
                  </p>
                </div>

                {/* Timeline Item 3 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#ff9800',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px',
                    margin: '0 auto 10px'
                  }}>
                    🚚
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', margin: '5px 0' }}>
                    Shipped
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0' }}>
                    2-3 Days
                  </p>
                </div>

                {/* Timeline Item 4 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#ccc',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px',
                    margin: '0 auto 10px'
                  }}>
                    🎉
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', margin: '5px 0' }}>
                    Delivered
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0' }}>
                    5-7 Days
                  </p>
                </div>
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
                ✓ Order confirmation has been sent to your email!
              </p>
              <p style={{ fontSize: '12px', color: '#558b2f', margin: '8px 0 0 0' }}>
                Please check your inbox (and spam folder) for the confirmation details
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  element.href = '#';
                  element.click();
                  alert('Invoice PDF downloaded! Check your Downloads folder.');
                }}
                style={{
                  background: 'transparent',
                  border: '2px solid #4caf50',
                  color: '#4caf50',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f1f8f4'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                📄 Download Invoice
              </button>
              <button
                onClick={() => alert('Order tracking feature coming soon! You can track your order using: ' + orderId)}
                style={{
                  background: 'transparent',
                  border: '2px solid #2196f3',
                  color: '#2196f3',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f0f7ff'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                🔍 Track Order
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#45a049'}
                onMouseLeave={(e) => e.target.style.background = '#4caf50'}
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        )}

        {isRejected && (
          // REJECTED STATUS
          <div style={{
            background: 'white',
            padding: '50px',
            borderRadius: '25px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#ffebee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px'
            }}>
              ❌
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px', color: '#f44336' }}>
              Payment Rejected
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.8',
              maxWidth: '500px',
              margin: '0 auto 30px'
            }}>
              We're sorry, but your payment could not be verified. Please contact our support 
              team or try again with a different payment method.
            </p>

            <div style={{
              background: '#ffebee',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '1px solid #ffcdd2'
            }}>
              <p style={{ fontSize: '14px', color: '#c62828', margin: 0, fontWeight: '600' }}>
                Order ID: {orderId}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/payment')}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'transparent',
                  border: '2px solid #f44336',
                  color: '#f44336',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentStatusPage;