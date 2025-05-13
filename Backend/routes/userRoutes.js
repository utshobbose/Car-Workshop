const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users (for admin/debugging)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Get current user from header
// router.get('/me', async (req, res) => {
//   try {
//     const userId = req.headers['userid'];
//     const user = await User.findById(userId).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
router.get('/me', async (req, res) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(400).json({ error: 'User ID missing in headers' });

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 🔐 Safe legacy fallback
    let cars = Array.isArray(user.cars) ? user.cars : [];

    if (cars.length === 0 && user.licenseNumber && user.engineNumber) {
      cars = [{
        licenseNumber: user.licenseNumber,
        engineNumber: user.engineNumber
      }];
    }

    res.json({ ...user.toObject(), cars }); // return with cars array
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});





// Add a new car to current user
router.post('/me/add-car', async (req, res) => {
  const { userId, licenseNumber, engineNumber } = req.body;

  if (!userId || !licenseNumber || !engineNumber) {
    return res.status(400).json({ error: 'Missing car details' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cars.push({ licenseNumber, engineNumber });
    await user.save();

    res.status(200).json({ message: 'New car added', cars: user.cars });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

module.exports = router;
