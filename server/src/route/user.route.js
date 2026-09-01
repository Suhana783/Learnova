const express = require('express');
const { getAllUsers, deleteUser } = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleBasedAccess = require('../middlewares/role.middleware');
const router = express.Router();

router.get('/getAll', authMiddleware, roleBasedAccess('admin'),getAllUsers);
router.delete('/delete/:id', authMiddleware, roleBasedAccess,deleteUser);

module.exports = router;
