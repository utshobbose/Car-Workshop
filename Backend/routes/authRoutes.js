const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const {checkAdmin} = require('../controllers/authController')
// const {createAdmin} = require('../controllers/authController');

router.get('/check-admin', verifyToken, checkAdmin);
// remove after creating admin
// router.post('/create-admin', createAdmin);

// POST /api/auth/signup
router.post('/signup', signup);

//POST /api/auth/login
router.post('/login', login);

module.exports = router;