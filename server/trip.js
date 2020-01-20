const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//adding parameter to Router
artistsRouter.param('artistId', (req, res, next, artistId) => {

    db.get(`
        select * from Artist
        where Artist.id = ${artistId};
    `, (err, row) => {
        
        if (err) {
            next(err);
        } else if (row) {
            req.artist = row;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

//get all rows of employed Artists
artistsRouter.get('/', (req, res, next) => {
    db.all(`
        select * from Artist
        where Artist.is_currently_employed = 1;
    `, (err, rows) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({ artists: rows });
        }
    });
});

//get specific Artist
artistsRouter.get('/:artistId', (req, res, next) => {
    res.status(200).json( {artist: req.artist} );
});

//post  artist
artistsRouter.post('/', (req, res, next) => {
//console.log(req);

    if (!req.body.artist.name || !req.body.artist.dateOfBirth || !req.body.artist.biography) {
        return res.sendStatus(400);
    }

    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;

    db.run(`
        insert into Artist (name, date_of_birth, biography, is_currently_employed)
        values ($name, $date_of_birth, $biography, $is_currently_employed);
    `, {
        $name: req.body.artist.name,
        $date_of_birth: req.body.artist.dateOfBirth,
        $biography: req.body.artist.biography,
        $is_currently_employed: isCurrentlyEmployed,
    }, function(err) {
        if (err) {
            next(err);
        } else {
         console.log(`Newly artist reated with id ${this.lastID}`);

            db.get(`
                select * from Artist
                where Artist.id = ${this.lastID};
            `, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(201).json({ artist: row });
                }
            });
        }

    });
});

artistsRouter.put('/:artistId', (req, res, next) => {
    const newArtistData = req.body.artist;
    console.log(newArtistData);

    db.run(`
        update Artist
        set name = $name, date_of_birth = $date_of_birth, biography = $biography, is_currently_employed = $is_currently_employed
        where Artist.id = ${req.artist.id};
    `, {
        $name: req.body.artist.name,
        $date_of_birth: req.body.artist.dateOfBirth,
        $biography: req.body.artist.biography,
        $is_currently_employed: req.body.artist.isCurrentlyEmployed,
    }, function(err) {
        if (err) {
            next(err);
        } else {
            console.log(`Artist with ${this.lastId} updated!`);

            db.get(`
                select * from Artist
                where Artist.id = ${this.lastID};
            `, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(201).json({ artist: row });
                }
            });
        }

    });

});



module.exports = artistsRouter;