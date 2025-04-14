const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
    name: String, 
    maxSlots: {type: Number, default: 4} //4 slots per day
});

module.exports = mongoose.model('Mechanic', mechanicSchema);