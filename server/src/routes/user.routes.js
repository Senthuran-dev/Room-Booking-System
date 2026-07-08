const express = require('express');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUserRole)
  .delete(deleteUser);

module.exports = router;
