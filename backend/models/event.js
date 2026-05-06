const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    date: String,
    location: String,
    price: String,
    image: String,
    availability: String
});

module.exports = mongoose.model('Event', EventSchema);