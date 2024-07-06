const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/postreferral', authMiddleware, referralController.createReferral);
router.get('/getreferral', authMiddleware, referralController.getUserReferrals);
router.get('/complete-referral', authMiddleware, referralController.completeReferral);

module.exports = router;