const Appointment = require('../models/Appointment');
const Mechanic = require('../models/Mechanic');

// Create appointment with full validation
const createAppointment = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { mechanicId, carDetails, appointmentDate } = req.body;

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Appointment.findOne({
      userId, 
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have an appointment on this date' });
    }

    const [mechanic, appointmentCount] = await Promise.all([
      Mechanic.findById(mechanicId),
      Appointment.countDocuments({
        mechanicId, 
        appointmentDate: new Date(appointmentDate)
      })
    ]);

    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });

    if (appointmentCount >= (mechanic.maxDailySlots || 4)) {
      return res.status(400).json({ error: 'Mechanic fully booked' });
    }

    const newAppointment = await Appointment.create({
      userId, 
      mechanicId, 
      carDetails,
      appointmentDate: new Date(appointmentDate)
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAppointments = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const role = req.headers['user-role'];
    const filter = role === 'admin' ? {} : { userId };

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name phone')
      .populate('mechanicId', 'name')
      .sort('-createdAt');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { mechanic, appointmentDate } = req.body;

    if (mechanic || appointmentDate) {
      const count = await Appointment.countDocuments({
        mechanic: mechanic,
        appointmentDate: new Date(appointmentDate)
      });

      if (count >= 4) {
        return res.status(400).json({ error: 'Mechanic/date is fully booked' });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('mechanic', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment
};
