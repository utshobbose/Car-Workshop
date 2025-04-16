const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mechanic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mechanic', 
    required: true 
  },
  carDetails: {
    licenseNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: v => /^[A-Z0-9]{6,12}$/.test(v),
        message: 'Invalid license number format'
      }
    },
    engineNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: v => /^[A-Z0-9]{6,12}$/.test(v),
        message: 'Invalid engine number format'
      }
    }
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);