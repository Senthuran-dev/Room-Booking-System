const express = require('express');
const { getAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getAnalytics);

module.exports = router;
