const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const carSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  engineNumber: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cars: [carSchema], // Replaces licenseNumber and engineNumber
  phone: { type: String, required: true },
  address: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
