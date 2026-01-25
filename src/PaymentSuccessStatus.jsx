import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccessStatus({ transaction, orderId, orderDate, orderTotal }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadInvoice = () => {
    const invoiceContent = `
INVOICE
================================
Order ID: ${orderId}
Date: ${orderDate}
Status: PAID ✓

ITEMS:
${transaction?.items?.map(item => {
  const product = item.productId || item;
  return `- ${product.name} (x${item.quantity}) | Rp. ${((product.price || 0) * item.quantity).toLocaleString('id-ID')}`;
}).join('\n') || 'N/A'}

SHIPPING ADDRESS:
${transaction?.shippingInfo ? `
${transaction.shippingInfo.fullName}
${transaction.shippingInfo.address}
${transaction.shippingInfo.city}
${transaction.shippingInfo.phone}
` : 'N/A'}

PAYMENT DETAILS:
Subtotal: Rp. ${(transaction?.subtotal || orderTotal).toLocaleString('id-ID')}
Shipping: Rp. ${(transaction?.shippingCost || 0).toLocaleString('id-ID')}
TOTAL: Rp. ${orderTotal.toLocaleString('id-ID')}

Generated: ${new Date().toLocaleString('id-ID')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent));
    element.setAttribute('download', `Invoice_${orderId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
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
          fontSize: '50px',
          boxShadow: '0 0 30px rgba(76, 175, 80, 0.3)'
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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: '#000' }}>{orderId}</span>
              <button
                onClick={() => copyToClipboard(orderId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4caf50',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '0'
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
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
              ✓ APPROVED
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
              🏠 Shipping Address
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
              📱 {transaction.shippingInfo.phone}
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#666' }}>Discount</span>
            <span style={{ fontWeight: '600', color: '#4caf50' }}>
              - Rp. 0
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
              margin: '0 auto 10px',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
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
              margin: '0 auto 10px',
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
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
              margin: '0 auto 10px',
              boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
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

      {/* Additional Info Box */}
      <div style={{
        background: '#f0f7ff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #b3e5fc',
        textAlign: 'left'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#01579b', margin: '0 0 12px 0' }}>
          ℹ️ What happens next?
        </h4>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#666' }}>
          <li style={{ marginBottom: '6px' }}>We're preparing your order for shipment</li>
          <li style={{ marginBottom: '6px' }}>You'll receive a tracking number via email when it ships</li>
          <li style={{ marginBottom: '6px' }}>You can track your package using the order ID above</li>
          <li>Expected delivery: 5-7 business days</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={downloadInvoice}
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
          onMouseEnter={(e) => {
            e.target.style.background = '#f1f8f4';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          📄 Download Invoice
        </button>
        <button
          onClick={() => alert('Order tracking feature coming soon! Track ID: ' + orderId)}
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
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f7ff';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🔍 Track Order
        </button>
        <button
          onClick={() => alert('Help & Support coming soon!')}
          style={{
            background: 'transparent',
            border: '2px solid #ff9800',
            color: '#ff9800',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#fff3e0';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          💬 Need Help?
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
          onMouseEnter={(e) => {
            e.target.style.background = '#45a049';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#4caf50';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🛍️ Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessStatus;
