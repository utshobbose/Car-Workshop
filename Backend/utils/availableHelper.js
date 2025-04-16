const getMechanicAvailability = async (date) => {
    const mechanics = await Mechanic.aggregate([
      {
        $lookup: {
          from: 'appointments',
          let: { mechanicId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$mechanic', '$$mechanicId'] },
                    { $eq: [
                      { $dateToString: { date: '$appointmentDate', format: '%Y-%m-%d' } }, 
                      date
                    ]}
                  ]
                }
              }
            }
          ],
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          availableSlots: { $subtract: [4, { $size: '$bookings' }] }
        }
      }
    ]);
  
    return mechanics.filter(m => m.availableSlots > 0);
  };
  
  module.exports = { getMechanicAvailability };