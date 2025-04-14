const express = require('express');
const router = express.router();

const {createAppointment, getAppointments, updateAppointment, getAvailableMechanics} = require('../controllers/appointmentController');
const {verifyToken, checkAdmin} = require('../middleware/auth');

router.post('/', verifyToken, createAppointment);
router.get('/', verifyToken, getAppointments);
router.put('/:id', verifyToken, checkAdmin, updateAppointment);
router.get('/mechanics', verifyToken, getAvailableMechanics);

module.exports = router;