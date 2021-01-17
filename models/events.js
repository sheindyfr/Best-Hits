const mongoose = require('mongoose'),
    id_validator = require('mongoose-id-validator');

var EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true,
        min: '2020-01-01',
        max: '2030-01-21'
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
}, { timestamps: true });
EventSchema.plugin(id_validator);
const Event = mongoose.model('Event', EventSchema);

module.exports = Event