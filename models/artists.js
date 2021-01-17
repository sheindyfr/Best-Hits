const mongoose = require('mongoose')

var ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('invalid id')
            }
        }
    },
    birth_year: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 1900 || value > 2020) {
                throw new Error('invalid birth year')
            }
        }
    },
    picture: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            try {
                new URL(value);
            } catch (_) {
                throw new Error('invalid url');
            }
        }
    },
    songs: [{
        type: String
    }]

}, { timestamps: true });

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist