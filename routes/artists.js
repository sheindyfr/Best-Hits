const { use } = require('./routes');
const Artist = require('../models/artists');


//-----------------------------------------------------------
// CRUD methods
//-----------------------------------------------------------
module.exports = {
    // ******* READ ARTISTS ******* //
    getArtists: function(req, res) {
        console.log("get artists - server");
        Artist.find().then(artists => {
            //sort data by the artist name
            artists.sort(function(a, b) {
                a = a.name.toLowerCase();
                b = b.name.toLowerCase();
                if (a > b)
                    return 1;
                else if (a < b)
                    return -1;
                return 0;
            });
            res.send(artists);
        }).catch(e => res.status(500).send())
    },

    // ******* CREATE ARTIST ******* //
    addArtist: function(req, res) {
        console.log("add artist - server");
        //the validation functions on the artist schema 
        //check the fields correction, if not, the catch 
        //will return the error, here is basic validation

        if (!req.body.id || isNaN(req.body.id) || !req.body.name ||
            !req.body.birth_year || !req.body.picture || !req.body.songs) {
            return res.status(400).send("Bad-Request");
        }
        // Check if ID already exist
        Artist.countDocuments({ id: req.body.id })
            .then(count => {
                if (count > 0) {
                    res.status(400).send("ID already exists");
                    return;
                } else {
                    const artist = new Artist(req.body)
                    artist.save().then(artist => {
                        res.status(201).send(artist)
                    }).catch(e => {
                        console.log(e);
                        res.status(400).send(e)
                    })
                }
            }).catch(e => res.status(400).send(e))
    },

    // ******* CREATE SONG ******* //
    addArtistSong: function(req, res) {
        const artistId = parseInt(req.params['tz']);
        const song = Object.keys(req.body)[0];

        if (isNaN(artistId)) {
            return res.status(400).send("Bad-Request, (add song, id is invalid)");
        }
        if (req.body == null) {
            return res.status(400).send("Bad-Request");
        }
        Artist.findOne({ id: artistId }).exec().then(artist => {
            if (artist == null) {
                res.status(404).send("artist doesnt exist");
            } else {
                artist.songs.push(song);
                artist.save((err) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.status(201).send("saved succesfully");
                    }
                });
            }
        }).catch(e => res.status(400).send(e));
    },

    // ******* DELETE ARTIST ******* //
    deleteArtist: function(req, res) {

        const artistId = req.params['id'];

        if (isNaN(artistId)) {
            return res.status(400).send("Bad-Request, id doesnt exist");
        }
        Artist.findOneAndRemove({ id: artistId }).exec()
            .then(doc => res.send(doc))
            .catch(e => res.status(400).send(e));
    },

    // ******* DELETE SONG ******* //
    deleteArtistSong: function(req, res) {
        const artistId = parseInt(req.params['tz']);
        const song = Object.keys(req.body)[0];
        var isExist = false;

        if (isNaN(artistId)) {
            return res.status(400).send("Bad-Request, (add song, id is invalid)");
        }
        if (req.body == null) {
            return res.status(400).send("Bad-Request");
        }
        // find the relevant artist by the id
        Artist.findOne({ id: artistId }).exec().then(artist => {
            if (artist == null) {
                res.status(404).send("artist doesnt exist");
            } else {
                // if song = '' --> delete all songs
                if (song == '') {
                    artist.songs = [];
                    artist.save((err) => {
                        if (err) {
                            res.status(400).send(err);
                        } else { res.status(201).send("saved succesfully"); }
                    });
                } else { // else --> check if song exists
                    for (var s in artist.songs) {
                        if (s == song) {
                            artist.songs.splice(song, 1);
                            isExist = true;
                            // save the changes of this artist
                            artist.save((err) => {
                                if (err) {
                                    res.status(400).send(err);
                                } else { res.status(201).send("saved succesfully"); }
                            });
                            break;
                        }
                    }
                    if (!isExist) res.status(400).send(err);
                }
            }
        }).catch(e => res.status(400).send(e));
    }
}