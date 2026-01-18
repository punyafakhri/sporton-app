import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const banks = [
    { id: 1, name: 'BCA', accountNumber: '1234567890', accountName: 'PT SportsOn Indonesia' },
    { id: 2, name: 'Mandiri', accountNumber: '0987654321', accountName: 'PT SportsOn Indonesia' },
    { id: 3, name: 'BNI', accountNumber: '5555666677', accountName: 'PT SportsOn Indonesia' },
    { id: 4, name: 'BRI', accountNumber: '8888999900', accountName: 'PT SportsOn Indonesia' }
  ];

  const orderTotal = 1523000;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!selectedBank) {
      alert('Please select a bank!');
      return;
    }
    if (!uploadedFile) {
      alert('Please upload your payment proof!');
      return;
    }
    
    // Redirect ke payment status page
    navigate('/payment-status');
  };

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
          onClick={() => navigate('/checkout')}
          style={{
            background: 'transparent',
            border: '2px solid #000',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Back to Checkout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 8% 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px', color: '#000' }}>
          Payment
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left Side - Bank Selection & Upload */}
          <div>
            {/* Bank Selection */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              marginBottom: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Select Bank Account
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                {banks.map(bank => (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    style={{
                      padding: '20px',
                      border: selectedBank?.id === bank.id ? '2px solid #ff5722' : '2px solid #e5e5e5',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      background: selectedBank?.id === bank.id ? '#fff5f2' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid ' + (selectedBank?.id === bank.id ? '#ff5722' : '#ccc'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedBank?.id === bank.id && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#ff5722'
                          }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '5px', color: '#000' }}>
                          {bank.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                          {bank.accountNumber}
                        </div>
                        <div style={{ fontSize: '13px', color: '#888' }}>
                          a/n {bank.accountName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Payment Proof */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Upload Payment Proof
              </h3>

              <div 
                style={{
                  border: '2px dashed #e5e5e5',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: '#fafafa',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {previewUrl ? (
                  <div>
                    <img src={previewUrl} alt="Preview" style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }} />
                    <p style={{ fontSize: '14px', color: '#666' }}>{uploadedFile?.name}</p>
                    <p style={{ fontSize: '13px', color: '#ff5722', marginTop: '10px', fontWeight: '600' }}>
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                      Click to upload
                    </p>
                    <p style={{ fontSize: '14px', color: '#888' }}>PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Right Side - Payment Instructions & Summary */}
          <div>
            {/* Payment Instructions */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              marginBottom: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Payment Instructions
              </h3>

              <div style={{
                background: '#fff5f2',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid #ffe5db'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  Total Amount to Pay
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ff5722' }}>
                  Rp. {orderTotal.toLocaleString('id-ID')}
                </div>
              </div>

              <ol style={{ fontSize: '14px', lineHeight: '1.8', color: '#666', paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#000' }}>Choose Bank:</strong> Select one of the available bank accounts above
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#000' }}>Transfer:</strong> Make a transfer with the exact amount shown
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#000' }}>Upload Proof:</strong> Take a screenshot or photo of your payment confirmation
                </li>
                <li>
                  <strong style={{ color: '#000' }}>Submit:</strong> Click the submit button below
                </li>
              </ol>
            </div>

            {/* Order Summary */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#000' }}>
                Order Summary
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '15px'
                }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>Rp. 1.498.000</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '15px'
                }}>
                  <span style={{ color: '#666' }}>Shipping</span>
                  <span style={{ fontWeight: '600' }}>Rp. 25.000</span>
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
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#ff5722' }}>
                    Rp. {orderTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitPayment}
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
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;