const express = require('express');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// creating router for /api/trips
const tripsRouter = express.Router();

// adding parameter to Router
tripsRouter.param('tripId', (req, res, next, tripId) => {

    db.get(`
        select * from Trips
        where Trips.id = ${tripId};
    `, (err, row) => {

        if (err) {
            next(err);
        } else if (row) {
            req.trip = row;
        } else {
            res.sendStatus(404);
        }

    });
   
});


//------- CORS functionallity

//--- GET all trips
tripsRouter.get('/', (req, res, next) => {
   
    db.all(`
        select * from Trips;
    `, (err, rows) => {

        if (err) {
            next(err);
        } else {
            res.status(200).json({trips: rows});
        }

    });

});

//--- GET specific trip
tripsRouter.get('./:tripId', (req, res, next) => {
    res.status(200).json({ trip: req.trip })
});

//--- POST tirp
tripsRouter.post('/', (req, res, next) => {
    //checking if the req.body is full of Data
    if (!req.body.trip.description || !req.body.trip.dateStart || !req.body.trip.dateEnd || !req.body.trip.totalCash) {
        return res.sendStatus(400);
    }

    db.run(`
        insert into Trips (description, trip_start, trip_end, total_cash)
        values ($description, $dateStart, $dateEnd, $totalCash);
    `, {
        $description: req.body.trip.description,
        $dateStart: req.body.trip.dateStart,
        $dateEnd: req.body.trip.dateEnd,
        $totalCash: req.body.trip.totalCash,
    }, function(err) {
            if (err) {
                next(err);
            } else {
                console.log(`Newly Trip with ID: ${this.lastID} is created`);

                db.get(`
                    select * from Trips
                    where Trips.id = ${this.lastID};
                `, (err, row) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(201).json({ trip: row });
                    }
                })
            }

    });

});









module.exports = tripsRouter;