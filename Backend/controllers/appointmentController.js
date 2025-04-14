const Appointment = require('../models/appointment');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { mechanicId, carDetails, appointmentDate } = req.body;
    const userId = req.user.userId;

    // Check if user already has appointment on this date
    const existingAppointment = await Appointment.findOne({
      user: userId,
      appointmentDate: new Date(appointmentDate)
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: 'You already have an appointment on this date'
      });
    }

    // Check mechanic availability
    const mechanic = await Mechanic.findById(mechanicId);
    const appointmentsCount = await Appointment.countDocuments({
      mechanic: mechanicId,
      appointmentDate: new Date(appointmentDate)
    });

    if (appointmentsCount >= mechanic.maxSlots) {
      return res.status(400).json({
        error: 'This mechanic is fully booked for the selected date'
      });
    }

    // Validate car details
    const licenseRegex = /^[A-Z0-9]{6,12}$/;
    const engineRegex = /^[A-Z0-9]{6,12}$/;

    if (!licenseRegex.test(carDetails.licenseNumber)) {
      return res.status(400).json({
        error: 'Invalid license number format (6-12 alphanumeric characters)'
      });
    }

    if (!engineRegex.test(carDetails.engineNumber)) {
      return res.status(400).json({
        error: 'Invalid engine number format (6-12 alphanumeric characters)'
      });
    }

    // Create appointment
    const newAppointment = await Appointment.create({
      user: userId,
      mechanic: mechanicId,
      carDetails,
      appointmentDate: new Date(appointmentDate)
    });

    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointments (admin sees all, users see their own)
exports.getAppointments = async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('user', 'name phone')
        .populate('mechanic', 'name');
    } else {
      appointments = await Appointment.find({ user: req.user.userId })
        .populate('mechanic', 'name');
    }

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment (admin only)
exports.updateAppointment = async (req, res) => {
  try {
    const { mechanicId, appointmentDate } = req.body;
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        mechanic: mechanicId,
        appointmentDate: new Date(appointmentDate)
      },
      { new: true, runValidators: true }
    )
    .populate('user', 'name phone')
    .populate('mechanic', 'name');

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updatedAppointment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableMechanics = async (req, res) => {
  try {
    const date = req.query.date; // Get date from URL like ?date=2024-05-20
    
    // 1. Get all mechanics
    const allMechanics = await Mechanic.find();
    
    // 2. Check availability for each mechanic
    const mechanicsWithSlots = await Promise.all(
      allMechanics.map(async (mechanic) => {
        // Count appointments for this mechanic on this date
        const appointmentCount = await Appointment.countDocuments({
          mechanic: mechanic._id,
          appointmentDate: {
            $gte: new Date(`${date}T00:00:00`), // Start of day
            $lt: new Date(`${date}T23:59:59`)    // End of day
          }
        });
        
        return {
          _id: mechanic._id,
          name: mechanic.name,
          availableSlots: 4 - appointmentCount
        };
      })
    );

    res.json(mechanicsWithSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};