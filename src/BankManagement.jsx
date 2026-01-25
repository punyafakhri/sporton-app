import React, { useState, useEffect } from 'react';
import { getBanks, createBank, updateBank, deleteBank } from './api/api';

function BankManagement() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    accountName: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const data = await getBanks();
      setBanks(data.data || data || []);
    } catch (err) {
      console.error('Error fetching banks:', err);
      
      // Fallback dummy data
      setBanks([
        { _id: '1', name: 'BCA', accountNumber: '1234567890', accountName: 'PT SportsOn Indonesia' },
        { _id: '2', name: 'Mandiri', accountNumber: '0987654321', accountName: 'PT SportsOn Indonesia' },
        { _id: '3', name: 'BNI', accountNumber: '5555666677', accountName: 'PT SportsOn Indonesia' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedBank(null);
    setFormData({
      name: '',
      accountNumber: '',
      accountName: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (bank) => {
    setModalMode('edit');
    setSelectedBank(bank);
    setFormData({
      name: bank.name || '',
      accountNumber: bank.accountNumber || '',
      accountName: bank.accountName || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBank(null);
    setFormData({
      name: '',
      accountNumber: '',
      accountName: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bank name is required';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only numbers';
    }
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const bankData = {
        name: formData.name,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName
      };

      if (modalMode === 'add') {
        await createBank(bankData);
        alert('✅ Bank added successfully!');
      } else {
        await updateBank(selectedBank._id || selectedBank.id, bankData);
        alert('✅ Bank updated successfully!');
      }
      
      await fetchBanks();
      closeModal();
    } catch (err) {
      console.error('Error saving bank:', err);
      alert('❌ Failed to save bank');
    }
  };

  const handleDelete = async (bank) => {
    if (window.confirm(`Are you sure you want to delete "${bank.name}"?`)) {
      try {
        await deleteBank(bank._id || bank.id);
        alert('✅ Bank deleted successfully!');
        await fetchBanks();
      } catch (err) {
        console.error('Error deleting bank:', err);
        alert('❌ Failed to delete bank');
      }
    }
  };

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNumber.includes(searchTerm) ||
    bank.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Loading banks...
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
        {/* Search Bar */}
        <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="🔍 Search banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e5e5',
              borderRadius: '10px',
              fontSize: '15px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          <span>Add Bank</span>
        </button>
      </div>

      {/* Banks Count */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing <strong>{filteredBanks.length}</strong> of <strong>{banks.length}</strong> banks
      </div>

      {/* Banks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredBanks.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#999',
            background: 'white',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏦</div>
            <div style={{ fontSize: '16px' }}>No banks found</div>
          </div>
        ) : (
          filteredBanks.map((bank) => (
            <div
              key={bank._id || bank.id}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  🏦
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: '#1a1a1a',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {bank.name}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    background: '#f5f5f5',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    Bank Account
                  </div>
                </div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#888',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    Account Number
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1a1a1a',
                    fontFamily: 'monospace',
                    letterSpacing: '1px'
                  }}>
                    {bank.accountNumber}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '11px',
                    color: '#888',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    Account Name
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#333'
                  }}>
                    {bank.accountName}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                paddingTop: '15px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  onClick={() => openEditModal(bank)}
                  style={{
                    flex: 1,
                    background: '#fff3e0',
                    color: '#f57c00',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f57c00';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff3e0';
                    e.target.style.color = '#f57c00';
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(bank)}
                  style={{
                    flex: 1,
                    background: '#ffebee',
                    color: '#d32f2f',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
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
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
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
        onClick={closeModal}
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
              color: '#1a1a1a'
            }}>
              {modalMode === 'add' ? '🏦 Add New Bank' : '✏️ Edit Bank'}
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '30px',
              fontSize: '14px'
            }}>
              {modalMode === 'add' ? 'Fill in the bank account details' : 'Update the bank account information'}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Bank Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., BCA, Mandiri, BNI"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.name ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.name && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.accountNumber ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.accountNumber && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="PT SportsOn Indonesia"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.accountName ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.accountName && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.accountName}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={closeModal}
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
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  {modalMode === 'add' ? 'Add Bank' : 'Update Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankManagement;