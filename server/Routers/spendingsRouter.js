const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// creating router for /api/spendings
const spendingsRouter = express.Router();

// adding parameter to Router
spendingsRouter.param('spendId', (req, res, next, spendId) => {
    
    // retrieving Spend row from Spends table
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

// GET /api/ideas to get an array of all ideas.
spendingsRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');

    if (ideas) {
        res.status(200).send(ideas);
  
    } else {
        res.status(404).send();
    }

});

// POST /api/ideas to create a new idea and save it to the database.
spendingsRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;
        addToDatabase('ideas', newIdea);
        res.status(201).send(newIdea);
});

// GET /api/ideas/:ideaId to get a single idea by id.
spendingsRouter.get('/:ideaId', (req, res, next) => {
    res.status(200).send(req.idea);
})

// PUT /api/ideas/:ideaId to update a single idea by id.
spendingsRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;

    if (!newIdea.name || !newIdea.description || !newIdea.numWeeks || !newIdea.weeklyRevenue) {
        res.status(400).send();
  
    } else {
        const newlyUpdatedIdea = updateInstanceInDatabase('ideas', req.body);
        res.status(202).send(newlyUpdatedIdea);
    }

});

// DELETE /api/ideas/:ideaId to delete a single idea by id.
spendingsRouter.delete('/:ideaId', (req, res, next) => {
    
    const isDeleted = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (isDeleted) {
        res.status(204).send();

    } else {
        res.sendStatus(500).send();
    }
});

module.exports = spendingsRouter;






