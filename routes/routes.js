const express = require('express'),
    path = require('path'),
    artistRouts = require('./artists'),
    eventsRouts = require('./events'),
    Artist = require('../models/artists');

const router = new express.Router();

router.get('/', (req, res) => {
    // empty path for the home page
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

//artists routes
router.get('/artists', artistRouts.getArtists);
router.post('/artists', artistRouts.addArtist);
router.post('/songs/:tz', artistRouts.addArtistSong);
router.delete('/artists/:id', artistRouts.deleteArtist);
router.delete('/songs/:tz', artistRouts.deleteArtistSong);

//event routes
router.get('/events', eventsRouts.getEvents);
router.post('/events', eventsRouts.addEvent);

module.exports = router;