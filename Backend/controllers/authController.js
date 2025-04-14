const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// exports.createAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Generate salt and hash
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const admin = await User.create({
//       name: 'Admin',
//       email,
//       password: hashedPassword,
//       phone: '000-000-0000',
//       role: 'admin'
//     });

//     res.status(201).json(admin);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.signup = async (req, res) => {
  try {
    const { name, email, licenseNumber, engineNumber, password, phone, address } = req.body;
    
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ 
      name, 
      email,
      licenseNumber,
      engineNumber, 
      password, // Will be hashed by pre-save hook
      phone,
      address 
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!comparePassword(password, user.password)){
      return res.status(401).json({error: 'Invalid password'});
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.checkAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ isAdmin: user.role === 'admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
