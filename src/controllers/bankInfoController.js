const BankInfo = require('../models/BankInfo');

// Get all bank info milik user
exports.getBankInfos = async (req, res) => {
  try {
    const bankInfos = await BankInfo.find({ user: req.user.id });
    res.status(200).json({ success: true, count: bankInfos.length, data: bankInfos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single bank info
exports.getBankInfo = async (req, res) => {
  try {
    const bankInfo = await BankInfo.findById(req.params.id);
    if (!bankInfo) {
      return res.status(404).json({ success: false, message: 'Bank info not found' });
    }
    res.status(200).json({ success: true, data: bankInfo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create bank info
exports.createBankInfo = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const bankInfo = await BankInfo.create(req.body);
    res.status(201).json({ success: true, message: 'Bank info created successfully', data: bankInfo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update bank info
exports.updateBankInfo = async (req, res) => {
  try {
    let bankInfo = await BankInfo.findById(req.params.id);
    if (!bankInfo) {
      return res.status(404).json({ success: false, message: 'Bank info not found' });
    }
    if (bankInfo.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    bankInfo = await BankInfo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Bank info updated successfully', data: bankInfo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete bank info
exports.deleteBankInfo = async (req, res) => {
  try {
    const bankInfo = await BankInfo.findById(req.params.id);
    if (!bankInfo) {
      return res.status(404).json({ success: false, message: 'Bank info not found' });
    }
    if (bankInfo.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await bankInfo.deleteOne();
    res.status(200).json({ success: true, message: 'Bank info deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};