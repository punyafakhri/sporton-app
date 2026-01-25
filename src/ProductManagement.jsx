import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from './api/api';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      setProducts(productsData.data || productsData || []);
      setCategories(categoriesData.data || categoriesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      image: '',
      description: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category?._id || product.category || '',
      price: product.price || '',
      image: product.image || product.imageUrl || '',
      description: product.description || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      image: '',
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
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
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
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description
      };

      if (modalMode === 'add') {
        await createProduct(productData);
        alert('✅ Product added successfully!');
      } else {
        await updateProduct(selectedProduct._id || selectedProduct.id, productData);
        alert('✅ Product updated successfully!');
      }
      
      await fetchData();
      closeModal();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('❌ Failed to save product');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product._id || product.id);
        alert('✅ Product deleted successfully!');
        await fetchData();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('❌ Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        Loading products...
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
            placeholder="🔍 Search products..."
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
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Count */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
      </div>

      {/* Products Table */}
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
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666', width: '80px' }}>IMAGE</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>PRODUCT NAME</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>CATEGORY</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#666' }}>PRICE</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: '#666', width: '150px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
                  <div style={{ fontSize: '16px' }}>No products found</div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id || product.id} style={{
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#f5f5f5',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '5px'
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
                      {product.name}
                    </div>
                    {product.description && (
                      <div style={{ fontSize: '13px', color: '#888', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {product.category?.name || product.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#ff5722' }}>
                      Rp. {product.price?.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => openEditModal(product)}
                        style={{
                          background: '#fff3e0',
                          color: '#f57c00',
                          border: 'none',
                          padding: '8px 16px',
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
                        onClick={() => handleDelete(product)}
                        style={{
                          background: '#ffebee',
                          color: '#d32f2f',
                          border: 'none',
                          padding: '8px 16px',
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
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
              {modalMode === 'add' ? '📦 Add New Product' : '✏️ Edit Product'}
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '30px',
              fontSize: '14px'
            }}>
              {modalMode === 'add' ? 'Fill in the details to add a new product' : 'Update the product information'}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
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

              {/* Category */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.category ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Price */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Price (Rp) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.price ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.price && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.image ? '2px solid #f44336' : '2px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.image && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '6px' }}>
                    {errors.image}
                  </p>
                )}
                {formData.image && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
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
                  placeholder="Enter product description"
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
                  {modalMode === 'add' ? 'Add Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;