const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Helper: Compare plain vs hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};


exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = new User({
      name: 'Admin',
      email,
      password,
      phone: '000-000-0000',
      role: 'admin'
    });

    await admin.save(); // ✅ Triggers pre-save hook for hashing

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, licenseNumber, engineNumber, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({
      name, email, licenseNumber, engineNumber, password, phone, address
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check admin
exports.checkAdmin = async (req, res) => {
  const userId = req.body.userid;

  if (!userId) return res.status(400).json({ error: 'User ID missing in body' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ isAdmin: user.role === 'admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
