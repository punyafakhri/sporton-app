const express = require('express');
const router = express.Router();
const {
  getBankInfos,
  getBankInfo,
  createBankInfo,
  updateBankInfo,
  deleteBankInfo
} = require('../controllers/bankInfoController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getBankInfos)
  .post(protect, createBankInfo);

router.route('/:id')
  .get(protect, getBankInfo)
  .put(protect, updateBankInfo)
  .delete(protect, deleteBankInfo);

module.exports = router;