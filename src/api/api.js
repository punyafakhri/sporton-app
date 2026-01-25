const dummyProducts = [
  {
    _id: '1',
    name: 'SportsOn HyperSoccer v2',
    category: { _id: 'cat1', name: 'Football' },
    price: 458000,
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
    description: 'The SportsOn HyperSoccer v2 is engineered for the player who demands precision, power, and unrivaled speed on the pitch. Crafted with cutting-edge materials for maximum performance and durability.'
  },
  {
    _id: '2',
    name: 'ProRunner Elite X',
    category: { _id: 'cat2', name: 'Running' },
    price: 520000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Experience the ultimate running experience with ProRunner Elite X. Designed with advanced cushioning technology and lightweight materials to maximize your speed and comfort during long distance runs.'
  },
  {
    _id: '3',
    name: 'Speed Trainer Pro',
    category: { _id: 'cat3', name: 'Training' },
    price: 380000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    description: 'Perfect for intensive training sessions. The Speed Trainer Pro provides excellent support and stability for high-intensity workouts. Built with breathable mesh and responsive cushioning technology.'
  },
  {
    _id: '4',
    name: 'Basketball Elite',
    category: { _id: 'cat4', name: 'Basketball' },
    price: 650000,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    description: 'Dominate the court with Basketball Elite shoes. Engineered with ankle support and excellent grip for quick cuts and jumps. Perfect for both competitive and recreational players.'
  },
  {
    _id: '5',
    name: 'Tennis Master Pro',
    category: { _id: 'cat5', name: 'Tennis' },
    price: 475000,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6',
    description: 'Professional tennis shoes designed for agility and quick movements. Features superior grip and durability for intense matches.'
  },
  {
    _id: '6',
    name: 'Gym Flex 360',
    category: { _id: 'cat3', name: 'Training' },
    price: 425000,
    image: 'https://images.unsplash.com/photo-1515396800500-83f80f297a3e',
    description: 'All-purpose training shoes with 360-degree flexibility. Perfect for gym workouts, CrossFit, and general fitness activities.'
  },
  {
    _id: '7',
    name: 'Street Runner X',
    category: { _id: 'cat2', name: 'Running' },
    price: 395000,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
    description: 'Urban running shoes with stylish design. Combines comfort and performance for both running and casual wear.'
  },
  {
    _id: '8',
    name: 'Soccer King Pro',
    category: { _id: 'cat1', name: 'Football' },
    price: 525000,
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26',
    description: 'Professional-grade soccer cleats with enhanced ball control. Designed for serious players who demand the best.'
  }
];

// Dummy Categories
const dummyCategories = [
  { _id: 'cat1', name: 'Football' },
  { _id: 'cat2', name: 'Running' },
  { _id: 'cat3', name: 'Training' },
  { _id: 'cat4', name: 'Basketball' },
  { _id: 'cat5', name: 'Tennis' },
  { _id: 'cat6', name: 'Outdoor' }
];

const dummyBanks = [
  { _id: 'bank1', name: 'BCA', accountNumber: '1234567890', accountName: 'PT SportsOn Indonesia' },
  { _id: 'bank2', name: 'Mandiri', accountNumber: '0987654321', accountName: 'PT SportsOn Indonesia' },
  { _id: 'bank3', name: 'BNI', accountNumber: '5555666677', accountName: 'PT SportsOn Indonesia' },
  { _id: 'bank4', name: 'BRI', accountNumber: '8888999900', accountName: 'PT SportsOn Indonesia' }
];

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('sporton_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('sporton_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const getTransactionsFromStorage = () => {
  try {
    const transactions = localStorage.getItem('sporton_transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error);
    return [];
  }
};

const saveTransactionsToStorage = (transactions) => {
  try {
    localStorage.setItem('sporton_transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
export const getProducts = async () => {
  await delay();
  console.log(' Fetching products (dummy data)');
  return { success: true, data: dummyProducts };
};

export const getProductById = async (id) => {
  await delay();
  console.log(' Fetching product by ID:', id);
  const product = dummyProducts.find(p => p._id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { success: true, data: product };
};

export const getCategories = async () => {
  await delay();
  console.log(' Fetching categories (dummy data)');
  return { success: true, data: dummyCategories };
};

// Product Management Functions
export const createProduct = async (productData) => {
  await delay(400);
  console.log(' Creating product:', productData);
  const newProduct = {
    _id: Date.now().toString(),
    ...productData
  };
  dummyProducts.push(newProduct);
  return { success: true, message: 'Product created', data: newProduct };
};

export const updateProduct = async (productId, productData) => {
  await delay(400);
  console.log(' Updating product:', productId, productData);
  const productIndex = dummyProducts.findIndex(p => p._id === productId);
  
  if (productIndex < 0) {
    throw new Error('Product not found');
  }
  
  dummyProducts[productIndex] = {
    ...dummyProducts[productIndex],
    ...productData
  };
  
  return { success: true, message: 'Product updated', data: dummyProducts[productIndex] };
};

export const deleteProduct = async (productId) => {
  await delay(400);
  console.log(' Deleting product:', productId);
  const productIndex = dummyProducts.findIndex(p => p._id === productId);
  
  if (productIndex < 0) {
    throw new Error('Product not found');
  }
  
  const deletedProduct = dummyProducts.splice(productIndex, 1)[0];
  return { success: true, message: 'Product deleted', data: deletedProduct };
};

// Category Management Functions
export const createCategory = async (categoryData) => {
  await delay(400);
  console.log(' Creating category:', categoryData);
  const newCategory = {
    _id: Date.now().toString(),
    ...categoryData
  };
  dummyCategories.push(newCategory);
  return { success: true, message: 'Category created', data: newCategory };
};

export const updateCategory = async (categoryId, categoryData) => {
  await delay(400);
  console.log(' Updating category:', categoryId, categoryData);
  const categoryIndex = dummyCategories.findIndex(c => c._id === categoryId);
  
  if (categoryIndex < 0) {
    throw new Error('Category not found');
  }
  
  dummyCategories[categoryIndex] = {
    ...dummyCategories[categoryIndex],
    ...categoryData
  };
  
  return { success: true, message: 'Category updated', data: dummyCategories[categoryIndex] };
};

export const deleteCategory = async (categoryId) => {
  await delay(400);
  console.log(' Deleting category:', categoryId);
  const categoryIndex = dummyCategories.findIndex(c => c._id === categoryId);
  
  if (categoryIndex < 0) {
    throw new Error('Category not found');
  }
  
  const deletedCategory = dummyCategories.splice(categoryIndex, 1)[0];
  return { success: true, message: 'Category deleted', data: deletedCategory };
};

export const getCart = async () => {
  await delay(300);
  console.log(' Fetching cart (from localStorage)');
  const cart = getCartFromStorage();
  
  const cartWithDetails = cart.map(item => {
    const product = dummyProducts.find(p => p._id === item.productId);
    return {
      ...item,
      productId: product || { _id: item.productId, name: 'Unknown Product', price: 0 }
    };
  });
  
  return { success: true, data: { items: cartWithDetails } };
};

export const addToCart = async (productId, quantity = 1) => {
  await delay(300);
  console.log(' Adding to cart:', { productId, quantity });
  
  const cart = getCartFromStorage();
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      addedAt: new Date().toISOString()
    });
  }
  
  saveCartToStorage(cart);
  return { success: true, message: 'Product added to cart' };
};

export const updateCartItem = async (productId, quantity) => {
  await delay(300);
  console.log(' Updating cart item:', { productId, quantity });
  
  const cart = getCartFromStorage();
  const itemIndex = cart.findIndex(item => item.productId === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCartToStorage(cart);
    return { success: true, message: 'Cart updated' };
  }
  
  throw new Error('Item not found in cart');
};

export const removeFromCart = async (productId) => {
  await delay(300);
  console.log(' Removing from cart:', productId);
  
  const cart = getCartFromStorage();
  const filteredCart = cart.filter(item => item.productId !== productId);
  saveCartToStorage(filteredCart);
  
  return { success: true, message: 'Item removed from cart' };
};

export const clearCart = async () => {
  await delay(300);
  console.log(' Clearing cart');
  localStorage.removeItem('sporton_cart');
  return { success: true, message: 'Cart cleared' };
};

export const createTransaction = async (transactionData) => {
  await delay(500);
  console.log(' Creating transaction:', transactionData);
  
  const transactions = getTransactionsFromStorage();
  
  const transactionId = 'TRX-' + Date.now();
  
  const newTransaction = {
    _id: transactionId,
    ...transactionData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    paymentProof: null,
    bankInfo: null
  };
  
  transactions.push(newTransaction);
  saveTransactionsToStorage(transactions);
  
  return { success: true, data: newTransaction };
};

export const uploadPaymentProof = async (transactionId, formData) => {
  await delay(800);
  console.log(' Uploading payment proof for transaction:', transactionId);
  
  const transactions = getTransactionsFromStorage();
  const transactionIndex = transactions.findIndex(t => t._id === transactionId);
  
  if (transactionIndex < 0) {
    throw new Error('Transaction not found');
  }
  
  const bankId = formData.get('bankId');
  const bankName = formData.get('bankName');
  
  transactions[transactionIndex].paymentProof = 'payment_proof_' + Date.now() + '.jpg';
  transactions[transactionIndex].bankInfo = {
    bankId,
    bankName,
    uploadedAt: new Date().toISOString()
  };
  transactions[transactionIndex].status = 'pending';
  
  saveTransactionsToStorage(transactions);
  
  return { 
    success: true, 
    message: 'Payment proof uploaded successfully',
    data: transactions[transactionIndex]
  };
};

export const getTransactionById = async (id) => {
  await delay(300);
  console.log(' Fetching transaction:', id);
  
  const transactions = getTransactionsFromStorage();
  const transaction = transactions.find(t => t._id === id);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return { success: true, data: transaction };
};

export const getAllTransactions = async () => {
  await delay(400);
  console.log('📋 Fetching all transactions');
  
  const transactions = getTransactionsFromStorage();
  return { success: true, data: transactions };
};

export const getBanks = async () => {
  await delay(300);
  console.log('🏦 Fetching banks (dummy data)');
  return { success: true, data: dummyBanks };
};

// Bank Management Functions
export const createBank = async (bankData) => {
  await delay(400);
  console.log(' Creating bank:', bankData);
  const newBank = {
    _id: Date.now().toString(),
    ...bankData
  };
  dummyBanks.push(newBank);
  return { success: true, message: 'Bank created', data: newBank };
};

export const updateBank = async (bankId, bankData) => {
  await delay(400);
  console.log(' Updating bank:', bankId, bankData);
  const bankIndex = dummyBanks.findIndex(b => b._id === bankId);
  
  if (bankIndex < 0) {
    throw new Error('Bank not found');
  }
  
  dummyBanks[bankIndex] = {
    ...dummyBanks[bankIndex],
    ...bankData
  };
  
  return { success: true, message: 'Bank updated', data: dummyBanks[bankIndex] };
};

export const deleteBank = async (bankId) => {
  await delay(400);
  console.log(' Deleting bank:', bankId);
  const bankIndex = dummyBanks.findIndex(b => b._id === bankId);
  
  if (bankIndex < 0) {
    throw new Error('Bank not found');
  }
  
  const deletedBank = dummyBanks.splice(bankIndex, 1)[0];
  return { success: true, message: 'Bank deleted', data: deletedBank };
};

export const approveTransaction = async (transactionId) => {
  await delay(400);
  console.log(' Approving transaction:', transactionId);
  
  const transactions = getTransactionsFromStorage();
  const transactionIndex = transactions.findIndex(t => t._id === transactionId);
  
  if (transactionIndex < 0) {
    throw new Error('Transaction not found');
  }
  
  transactions[transactionIndex].status = 'approved';
  transactions[transactionIndex].approvedAt = new Date().toISOString();
  
  saveTransactionsToStorage(transactions);
  
  await clearCart();
  
  return { success: true, message: 'Transaction approved', data: transactions[transactionIndex] };
};

export const rejectTransaction = async (transactionId, reason) => {
  await delay(400);
  console.log(' Rejecting transaction:', transactionId);
  
  const transactions = getTransactionsFromStorage();
  const transactionIndex = transactions.findIndex(t => t._id === transactionId);
  
  if (transactionIndex < 0) {
    throw new Error('Transaction not found');
  }
  
  transactions[transactionIndex].status = 'rejected';
  transactions[transactionIndex].rejectedAt = new Date().toISOString();
  transactions[transactionIndex].rejectionReason = reason;
  
  saveTransactionsToStorage(transactions);
  
  return { success: true, message: 'Transaction rejected', data: transactions[transactionIndex] };
};

export const resetAllData = () => {
  localStorage.removeItem('sporton_cart');
  localStorage.removeItem('sporton_transactions');
  console.log('🔄 All data reset');
};

export default {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createTransaction,
  uploadPaymentProof,
  getTransactionById,
  getAllTransactions,
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  approveTransaction,
  rejectTransaction,
  resetAllData
};
