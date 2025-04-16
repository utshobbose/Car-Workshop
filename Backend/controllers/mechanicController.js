const Mechanic = require('../models/Mechanic');
const { getMechanicAvailability } = require('../utils/availableHelper');

// Create new mechanic (Admin only)
exports.createMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.create(req.body);
    res.status(201).json(mechanic);
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
};

// Get all mechanics with availability for a date
exports.getMechanics = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (date) {
      // Get mechanics with available slots
      const mechanics = await getMechanicAvailability(date);
      return res.json(mechanics);
    }

    // Get all active mechanics
    const allMechanics = await Mechanic.find({ isActive: true });
    res.json(allMechanics);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Update mechanic (Admin only)
exports.updateMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(mechanic);
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
};