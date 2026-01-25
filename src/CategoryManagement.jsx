import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from './api/api';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.data || data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: ''
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
      newErrors.name = 'Category name is required';
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
      const categoryData = {
        name: formData.name,
        description: formData.description
      };

      if (modalMode === 'add') {
        await createCategory(categoryData);
        alert('✅ Category added successfully!');
      } else {
        await updateCategory(selectedCategory._id || selectedCategory.id, categoryData);
        alert('✅ Category updated successfully!');
      }
      
      await fetchCategories();
      closeModal();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('❌ Failed to save category');
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category._id || category.id);
        alert('✅ Category deleted successfully!');
        await fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('❌ Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        Loading categories...
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
            placeholder="🔍 Search categories..."
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
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Count */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing <strong>{filteredCategories.length}</strong> of <strong>{categories.length}</strong> categories
      </div>

      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredCategories.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#999',
            background: 'white',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏷️</div>
            <div style={{ fontSize: '16px' }}>No categories found</div>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category._id || category.id}
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
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  🏷️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1a1a1a',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {category.name}
                  </h3>
                </div>
              </div>

              {category.description && (
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '20px',
                  lineHeight: '1.6',
                  minHeight: '40px'
                }}>
                  {category.description}
                </p>
              )}

              <div style={{
                display: 'flex',
                gap: '10px',
                paddingTop: '15px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  onClick={() => openEditModal(category)}
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
                  onClick={() => handleDelete(category)}
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
              {modalMode === 'add' ? '🏷️ Add New Category' : '✏️ Edit Category'}
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '30px',
              fontSize: '14px'
            }}>
              {modalMode === 'add' ? 'Fill in the details to add a new category' : 'Update the category information'}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
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

              {/* Description */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
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
                  {modalMode === 'add' ? 'Add Category' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;