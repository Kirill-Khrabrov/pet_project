const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const spendsRouter = require('./spendsRouter.js');


// creating router for /api/trips
const tripsRouter = express.Router();

//nesting spendingsRouter inside /trips path
tripsRouter.use('/:tripId/spends', spendsRouter);

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
            next();

        } else {
            res.sendStatus(404);
        }

    });
   
});

// CORS functionallity
// GET......................................... 
// ...all trips
tripsRouter.get('/', (req, res, next) => {
  
    db.all(`
        select * from Trips;
    `, (err, rows) => {

        if (err) {
            next(err);
      
        } else {
            res.status(200).json(rows);
        }

    });

});

// ...specific trip
tripsRouter.get('/:tripId', (req, res, next) => {
    res.status(200).send(req.trip);
});

// POST........................................
// ...Trip
tripsRouter.post('/', (req, res, next) => {
    //checking if the req.body is full of Data
    if (!req.body.trip.description || !req.body.trip.dateStart || !req.body.trip.dateEnd || !req.body.trip.totalCash) {
        return res.sendStatus(400);
    }
    
    // inserting req.body to Trips table
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
                // sending back the newly created Trip
                db.get(`
                    select * from Trips
                    where Trips.id = ${this.lastID};
                `, (err, row) => {
                   
                    if (err) {
                        next(err);
                   
                    } else {
                        res.status(201).json({ trip: row });
                    }
                
                });
            
            }

    });

});

// PUT.........................................
// ...Trip
tripsRouter.put('/:tripId', (req, res, next) => {
    
    const newTrip = req.body.trip;
    
    db.run(`
        update Trips
        set description = $description,
            trip_start = $dateStart,
            trip_end = $dateEnd,
            total_cash = $totalCash
        where Trips.id = ${req.trip.id}; 
    `, {
        $description: newTrip.description,
        $dateStart: newTrip.dateStart,
        $dateEnd: newTrip.dateEnd,
        $totalCash: newTrip.totalCash,
    }, function(err) {
        
        if (err) {
            next(err);
       
        } else {
           
            db.get(`
                    select * from Trips
                    where Trips.id = ${req.trip.id};
                `, (err, row) => {
                    
                    if (err) {
                        next(err);
                  
                    } else {
                        res.status(200).json({ trip: row });
                    }
                
            });
        
        }
        
    });

});

// DELETE......................................
// ...Trip
tripsRouter.delete('/:tripId', (req, res, next) => {
    
    db.serialize(function() {
        
        // deleting Trip from Trips Table
        db.run(`
            delete from Trips
            where Trips.id = ${req.trip.id}
        `, function(err) {
            if (err) {
                next(err);
            } 
        });

        // deleting corresponding Expenses from Spends Table
         db.run(`
            delete from Spends
            where Spends.trip_id = ${req.trip.id} 
        `, function(err) {
            if (err) {
                next(err);
            
            } else {
                res.sendStatus(204);
            }
        
        });

    });

});

module.exports = tripsRouter;