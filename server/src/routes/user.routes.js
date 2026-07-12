const express = require('express');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUserRole)
  .delete(deleteUser);

module.exports = router;
