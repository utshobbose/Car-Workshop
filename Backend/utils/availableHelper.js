const Mechanic = require('../models/Mechanic');
const Appointment = require('../models/Appointment');

const getMechanicAvailability = async (date) => {
  const allMechanics = await Mechanic.find({ isActive: true });

  const mechanicAvailability = await Promise.all(
    allMechanics.map(async (mechanic) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const count = await Appointment.countDocuments({
        mechanic: mechanic._id,
        appointmentDate: { $gte: start, $lt: end }
      });

      return {
        _id: mechanic._id,
        name: mechanic.name,
        availableSlots: (mechanic.maxDailySlots || 4) - count
      };
    })
  );

  return mechanicAvailability.filter(m => m.availableSlots > 0);
};

module.exports = { getMechanicAvailability };

