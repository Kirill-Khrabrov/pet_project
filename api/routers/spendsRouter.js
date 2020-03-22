const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// creating nested Router for /api/Trips/spendings
const spendsRouter = express.Router({mergeParams: true});

spendsRouter.param('spendId', (req, res, next, spendId) => {
  
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

// CORS functionallity
// GET......................................... 
// ...all spends for specific trip
spendsRouter.get('/', (req, res, next) => {
  
    db.all(`
        select * from Spends
        where Spends.trip_id = ${req.params.tripId};
    `, (err, rows) => {

        if (err) {
            next(err);
      
        } else {
            res.status(200).json(rows);
        }

    });

});

// ...specific Spend
spendsRouter.get('/:spendId', (req, res, next) => {
    res.status(200).send(req.spend);
});

// POST........................................ 
// ...Spend
spendsRouter.post('/', (req, res, next) => {
    
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

// PUT.........................................
// ...Spend
spendsRouter.put('/:spendId', (req, res, next) => {
    
    const updatedSpend = req.body.spend;
    
    db.run(`
        update Spends
        set description = $description,
            date = $date,
            spends_sum = $spends_sum
        where Spends.id = ${req.spend.id}; 
    `, {
        $description: updatedSpend.description,
        $date: updatedSpend.date,
        $spends_sum: updatedSpend.spendCash,        
    }, function(err) {
        
        if (err) {
            next(err);
       
        } else {
           
            db.get(`
                select * from Spends
                where Spends.id = ${req.spend.id};
            `, (err, row) => {
                    
                if (err) {
                    next(err);
                  
                } else {
                    res.status(200).json({ spend: row });
                }
                
            });
        }
        
    });

});

// DELETE......................................
// ...Spend
spendsRouter.delete('/:spendId', (req, res, next) => {
    
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

module.exports = spendsRouter;






