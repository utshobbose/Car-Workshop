const express = require('express');
const router = express.Router();
const {
  createMechanic,
  getMechanics,
  updateMechanic
} = require('../controllers/mechanicController');

// No more verifyToken
router.get('/', getMechanics);
router.post('/', createMechanic);
router.patch('/:id', updateMechanic);

module.exports = router;
