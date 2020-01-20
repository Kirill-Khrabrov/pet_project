const express = require('express');
const { getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId } = require('../db');

// /api/minions
const minionRouter = express.Router();

minionRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);

    if (minion) {
        req.minion = minion;
        next();
    } else {
        console.log(`No such minion with ID: ${id}`)
        res.status(404).send();
    }
});



// GET /api/minions to get an array of all minions.
minionRouter.get('/', (req, res, next) => {
    const minions = getAllFromDatabase('minions');

    if (minions) {
        res.status(200).send(minions);
        
    } else {
        res.status(404).send();
    }
});


// POST /api/minions to create a new minion and save it to the database.
minionRouter.post('/', (req, res, next) => {
    const newMinion = req.body;
        addToDatabase('minions', newMinion);
        res.status(201).send(newMinion);
});

// GET /api/minions/:minionId to get a single minion by id.
minionRouter.get('/:minionId', (req, res, next) => {
    res.status(200).send(req.minion);
});




// PUT /api/minions/:minionId to update a single minion by id.
minionRouter.put('/:minionId', (req, res, next) => {
    if (!req.body.name || !req.body.title || !req.body.weaknesses || !req.body.salary) {
        //debug logging
        //console.log('Not enough data to update minion!');
        res.status(400).send();
  
    } else {
        const newlyUpdatedMinion = updateInstanceInDatabase('minions', req.body);
        // gebug logging
        //console.log(newlyUpdatedMinion);
        res.status(202).send(newlyUpdatedMinion);
    }
});


// DELETE /api/minions/:minionId to delete a single minion by id.
minionRouter.delete('/:minionId', (req, res, next) => {
    
        const isDeleted = deleteFromDatabasebyId('minions', req.params.minionId);
        if (isDeleted) {
            res.status(204).send();

        } else {
            console.log(`Something went wrong trying to delete a minion`);
            res.sendStatus(500).send();
        }
});

//setting workRouter
const workRouter = require('./workRouter');
minionRouter.use('/:minionId/work', workRouter);


module.exports = minionRouter;