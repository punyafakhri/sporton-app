import React, { useState, useEffect } from 'react';
import { getAllTransactions, approveTransaction, rejectTransaction, getTransactionById } from './api/api';

function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [transactionToReject, setTransactionToReject] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data.data || data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      
      // Fallback dummy data untuk testing
      setTransactions([
        {
          _id: 'TRX001',
          shippingInfo: { fullName: 'John Doe', email: 'john@example.com', phone: '081234567890' },
          items: [{ productId: { name: 'Product 1', price: 100000 }, quantity: 2 }],
          totalAmount: 225000,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transaction) => {
    if (window.confirm(`Are you sure you want to approve transaction ${transaction._id}?`)) {
      try {
        await approveTransaction(transaction._id || transaction.id);
        alert('✅ Transaction approved successfully!');
        await fetchTransactions();
        if (isDetailOpen) setIsDetailOpen(false);
      } catch (err) {
        console.error('Error approving transaction:', err);
        alert('❌ Failed to approve transaction');
      }
    }
  };

  const openRejectModal = (transaction) => {
    setTransactionToReject(transaction);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectTransaction(transactionToReject._id || transactionToReject.id, rejectReason);
      alert('✅ Transaction rejected successfully!');
      await fetchTransactions();
      setIsRejectModalOpen(false);
      setTransactionToReject(null);
      setRejectReason('');
      if (isDetailOpen) setIsDetailOpen(false);
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      alert('❌ Failed to reject transaction');
    }
  };

  const openDetail = async (transaction) => {
    try {
      // Try to fetch full details
      const fullData = await getTransactionById(transaction._id || transaction.id);
      setSelectedTransaction(fullData.data || fullData || transaction);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setSelectedTransaction(transaction);
    }
    setIsDetailOpen(true);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesSearch = 
      txn._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.shippingInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.shippingInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fff3e0', color: '#e65100', label: '⏳ Pending' },
      approved: { bg: '#e8f5e9', color: '#2e7d32', label: '✅ Approved' },
      rejected: { bg: '#ffebee', color: '#c62828', label: '❌ Rejected' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700'
      }}>
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '20px',
        fontWeight: '700'
      }}>
        Loading transactions...
      </div>
    );
  }

  return (
    <div>
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Search & Filter */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              maxWidth: '400px',
              padding: '12px 16px',
              border: '2px solid #e5e5e5',
              borderRadius: '10px',
              fontSize: '15px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e5e5',
              borderRadius: '10px',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchTransactions}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Total Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a' }}>
            {transactions.length}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderLeft: '4px solid #e65100'
        }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Pending</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#e65100' }}>
            {transactions.filter(t => t.status === 'pending').length}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderLeft: '4px solid #2e7d32'
        }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Approved</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#2e7d32' }}>
            {transactions.filter(t => t.status === 'approved').length}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderLeft: '4px solid #c62828'
        }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Rejected</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#c62828' }}>
            {transactions.filter(t => t.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Transactions Count */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>TRANSACTION ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>CUSTOMER</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>ITEMS</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>TOTAL</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>STATUS</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: '#666', width: '200px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
                  <div style={{ fontSize: '16px' }}>No transactions found</div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn._id || txn.id} style={{
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', fontFamily: 'monospace' }}>
                      {txn._id || txn.id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {new Date(txn.createdAt).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>
                      {txn.shippingInfo?.fullName || 'N/A'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                      {txn.shippingInfo?.email || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>
                      {txn.items?.length || 0} item(s)
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#ff5722' }}>
                      Rp. {txn.totalAmount?.toLocaleString('id-ID') || 0}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {getStatusBadge(txn.status)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => openDetail(txn)}
                        style={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#1976d2';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#e3f2fd';
                          e.target.style.color = '#1976d2';
                        }}
                      >
                        👁️ Detail
                      </button>
                      
                      {txn.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(txn)}
                            style={{
                              background: '#e8f5e9',
                              color: '#2e7d32',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '700',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#2e7d32';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#e8f5e9';
                              e.target.style.color = '#2e7d32';
                            }}
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(txn)}
                            style={{
                              background: '#ffebee',
                              color: '#d32f2f',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '700',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#d32f2f';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#ffebee';
                              e.target.style.color = '#d32f2f';
                            }}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedTransaction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => setIsDetailOpen(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '30px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '8px',
                  color: '#1a1a1a'
                }}>
                  Transaction Details
                </h2>
                <div style={{
                  fontSize: '14px',
                  color: '#888',
                  fontFamily: 'monospace'
                }}>
                  {selectedTransaction._id || selectedTransaction.id}
                </div>
              </div>
              
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0'
                }}
              >
                ✕
              </button>
            </div>

            {/* Status */}
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                    Status
                  </div>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                    Order Date
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>
                    {new Date(selectedTransaction.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#1a1a1a'
              }}>
                👤 Customer Information
              </h3>
              <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '10px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Name: </span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>
                    {selectedTransaction.shippingInfo?.fullName}
                  </span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Email: </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {selectedTransaction.shippingInfo?.email}
                  </span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Phone: </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {selectedTransaction.shippingInfo?.phone}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '13px', color: '#888' }}>Address: </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {selectedTransaction.shippingInfo?.address}, {selectedTransaction.shippingInfo?.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#1a1a1a'
              }}>
                🛒 Order Items
              </h3>
              {selectedTransaction.items?.map((item, idx) => {
                const product = item.productId || item;
                return (
                  <div key={idx} style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        Qty: {item.quantity} × Rp. {product.price?.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#ff5722' }}>
                      Rp. {((product.price || 0) * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Summary */}
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#1a1a1a'
              }}>
                💰 Payment Summary
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>
                  Rp. {(selectedTransaction.subtotal || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '15px',
                borderBottom: '2px solid #e0e0e0',
                fontSize: '14px'
              }}>
                <span style={{ color: '#666' }}>Shipping</span>
                <span style={{ fontWeight: '600' }}>
                  Rp. {(selectedTransaction.shippingCost || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '15px'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#ff5722' }}>
                  Rp. {selectedTransaction.totalAmount?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            {selectedTransaction.status === 'pending' && (
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '2px solid #f0f0f0'
              }}>
                <button
                  onClick={() => handleApprove(selectedTransaction)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  ✅ Approve Transaction
                </button>
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    openRejectModal(selectedTransaction);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                  }}
                >
                  ❌ Reject Transaction
                </button>
              </div>
            )}

            {selectedTransaction.status === 'rejected' && selectedTransaction.rejectionReason && (
              <div style={{
                background: '#ffebee',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '20px',
                border: '1px solid #ffcdd2'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#c62828', marginBottom: '6px' }}>
                  Rejection Reason:
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {selectedTransaction.rejectionReason}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '20px'
        }}
        onClick={() => setIsRejectModalOpen(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '28px',
              fontWeight: '900',
              marginBottom: '10px',
              color: '#d32f2f'
            }}>
              ❌ Reject Transaction
            </h2>
            <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Rejection Reason *
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            rows="4"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e5e5',
              borderRadius: '10px',
              fontSize: '15px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsRejectModalOpen(false)}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f5f5f5',
              color: '#666',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)'
            }}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
}

export default TransactionManagement;