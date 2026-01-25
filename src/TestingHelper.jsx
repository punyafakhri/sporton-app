import React, { useState, useEffect } from 'react';
import { getAllTransactions, approveTransaction, rejectTransaction, resetAllData } from './api/api';

function TestingHelper() {
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  const handleApprove = async (transactionId) => {
    try {
      await approveTransaction(transactionId);
      alert(' Transaction approved!');
      fetchTransactions();
    } catch (error) {
      alert('Error approving transaction');
      console.error(error);
    }
  };

  const handleReject = async (transactionId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await rejectTransaction(transactionId, reason);
      alert(' Transaction rejected!');
      fetchTransactions();
    } catch (error) {
      alert('Error rejecting transaction');
      console.error(error);
    }
  };

  const handleResetData = () => {
    if (window.confirm('⚠️ Reset all data (cart & transactions)? This cannot be undone!')) {
      resetAllData();
      alert('🔄 All data has been reset!');
      fetchTransactions();
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}
        title="Admin Testing Panel"
      >
        
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>
             Testing Helper
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #ffc107'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
             <strong>Testing Mode:</strong> Gunakan panel ini untuk approve/reject transactions
            tanpa perlu admin panel. Data disimpan di localStorage.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '10px',
              fontWeight: '600'
            }}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
          <button
            onClick={handleResetData}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
             Reset All Data
          </button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px' }}>
          Transactions ({transactions.length})
        </h3>

        {transactions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999',
            background: '#f5f5f5',
            borderRadius: '10px'
          }}>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '5px' }}>
                      {transaction._id}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {new Date(transaction.createdAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    background: 
                      transaction.status === 'approved' ? '#e8f5e9' :
                      transaction.status === 'rejected' ? '#ffebee' : '#fff3e0',
                    color: 
                      transaction.status === 'approved' ? '#2e7d32' :
                      transaction.status === 'rejected' ? '#c62828' : '#e65100'
                  }}>
                    {transaction.status.toUpperCase()}
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    Customer: <strong>{transaction.shippingInfo?.fullName || 'N/A'}</strong>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    Items: <strong>{transaction.items?.length || 0}</strong>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#ff5722' }}>
                    Total: Rp. {transaction.totalAmount?.toLocaleString('id-ID') || 0}
                  </div>
                </div>

                {transaction.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                      onClick={() => handleApprove(transaction._id)}
                      style={{
                        flex: 1,
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                       Approve
                    </button>
                    <button
                      onClick={() => handleReject(transaction._id)}
                      style={{
                        flex: 1,
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                       Reject
                    </button>
                  </div>
                )}

                {transaction.status === 'approved' && (
                  <div style={{
                    background: '#e8f5e9',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    fontSize: '13px',
                    color: '#2e7d32'
                  }}>
                     Approved at: {new Date(transaction.approvedAt).toLocaleString('id-ID')}
                  </div>
                )}

                {transaction.status === 'rejected' && (
                  <div style={{
                    background: '#ffebee',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    fontSize: '13px',
                    color: '#c62828'
                  }}>
                     Rejected: {transaction.rejectionReason || 'No reason provided'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestingHelper;