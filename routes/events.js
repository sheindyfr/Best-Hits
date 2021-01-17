const { use } = require('./routes');
const Event = require('../models/events');

module.exports = {
    // ******* READ EVENTS ******* //
    getEvents: function(req, res) {
        Event.find().populate('artists')
            .then(events => res.send(events))
            .catch(e => res.status(500).send(e))
    },

    // ******* CREATE EVENT ******* //
    addEvent: function(req, res) {
        //the validation functions on the event schema 
        //check the fields correction, if not, the catch 
        //will return the error, here is basic validation

        if (!req.body.name || !req.body.location ||
            !req.body.date || !req.body.artists) {
            return res.status(400).send("Bad-Request");
        }
        const event = new Event(req.body);
        event.save().then(event => {
            res.status(201).send(event)
        }).catch(e => {
            console.log(e);
            res.status(400).send(e)
        })
    }
}