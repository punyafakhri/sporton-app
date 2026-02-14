const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// Get all transactions milik user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('product', 'name price')
      .populate('bankInfo', 'bankName accountNumber');
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name price')
      .populate('bankInfo', 'bankName accountNumber');
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create transaction
exports.createTransaction = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    req.body.user = req.user.id;
    req.body.totalPrice = product.price * req.body.quantity;
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, message: 'Transaction created successfully', data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update transaction status
exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Transaction updated successfully', data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await transaction.deleteOne();
    res.status(200).json({ success: true, message: 'Transaction deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};