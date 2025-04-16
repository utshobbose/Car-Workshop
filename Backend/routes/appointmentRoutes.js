const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment
} = require('../controllers/appointmentController');

// userId will be passed in request header
router.post('/', createAppointment);
router.get('/', getAppointments);
router.patch('/:id', updateAppointment);

module.exports = router;
