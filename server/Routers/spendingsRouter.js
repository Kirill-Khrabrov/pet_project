const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// creating nested Router for /api/Trips/spendings
const spendingsRouter = express.Router({mergeParams: true});

spendingsRouter.param('spendId', (req, res, next, spendId) => {
  
    db.get(`
        select * from Spends
        where Spends.id = ${spendId};
    `, (err, row) => {

        if (err) {
            next(err);
       
        } else if (row) {
            req.spend = row;
            next();
        } else {
            res.sendStatus(404);
        }

    });
   
});


//------- CORS functionallity

//--- GET all spends for specific trip
spendingsRouter.get('/', (req, res, next) => {
  
    db.all(`
        select * from Spends
        where SPends.trip_id = ${req.params.tripId};
    `, (err, rows) => {

        if (err) {
            next(err);
      
        } else {
            res.status(200).json(rows);
        }

    });

});

//--- GET specific Spend
spendingsRouter.get('/:spendId', (req, res, next) => {
    res.status(200).send(req.spend);
    });



//--- POST Spend
spendingsRouter.post('/', (req, res, next) => {
    //checking if the req.body is full of Data
    if (!req.body.spend.date || !req.body.spend.description || !req.body.spend.spendCash ) {
        return res.sendStatus(400);
    }
    
    // inserting req.body to Trips table
    db.run(`
        insert into Spends (trip_id, description, date, spends_sum)
        values ($tripId, $description, $date, $spends_sum);
    `, {
        $tripId: req.body.spend.tripId,
        $description: req.body.spend.description,
        $date: req.body.spend.date,
        $spends_sum: req.body.spend.spendCash,
       }, function(err) {
        
        if (err) {
                next(err);
         
            } else {
                // sending back the newly created Trip
                db.get(`
                    select * from Spends
                    where Spends.id = ${this.lastID};
                `, (err, row) => {
                   
                    if (err) {
                        next(err);
                   
                    } else {
                        res.status(201).json({ spend: row });
                    }
                });
            }

    });

});

//--- PUT to update Trip
spendingsRouter.put('/:tripId', (req, res, next) => {
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

//--- DELETE Trip
spendingsRouter.delete('/:spendId', (req, res, next) => {
    
    db.run(`
        delete from Spends
        where Spends.id = ${req.spend.id} 
    `, function(err) {
        
        if (err) {
            next(err);
       
        } else {
            
            res.sendStatus(204);
        }
    });

});

module.exports = spendingsRouter;






