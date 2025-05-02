const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },
  carDetails: {
    licenseNumber: { type: String, required: true },
    engineNumber: { type: String, required: true }, 
  },
  appointmentDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});


module.exports = mongoose.model('Appointment', appointmentSchema);