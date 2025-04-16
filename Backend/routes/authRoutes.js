const express = require('express');
const { signup, login, checkAdmin, createAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/create-admin', createAdmin);

router.get('/check-admin', checkAdmin);

module.exports = router;
