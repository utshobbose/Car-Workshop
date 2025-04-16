const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mechanic name is required'],
    trim: true
  },
  specialization: {
    type: String,
    enum: ['Engine', 'Transmission', 'Brakes', 'Electrical', 'General'],
    default: 'General'
  },
  maxDailySlots: {
    type: Number,
    default: 4,
    min: 1,
    max: 4
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Add index for faster queries
mechanicSchema.index({ name: 1, isActive: 1 });

module.exports = mongoose.model('Mechanic', mechanicSchema);