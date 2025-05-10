const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Helper: Compare plain vs hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Create Admin (default car info not required)
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

    await admin.save(); // Will hash password via pre-save hook

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Signup - saves car info in `cars` array
exports.signup = async (req, res) => {
  try {
    const { name, email, licenseNumber, engineNumber, password, phone, address } = req.body;

    // Basic validation
    if (!name || !email || !licenseNumber || !engineNumber || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      cars: [
        {
          licenseNumber,
          engineNumber
        }
      ]
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

// Check admin role
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
