const express = require('express');
const { getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId } = require('../db');
const checkMillionDollarIdea = require('../checkMillionDollarIdea');

// /api/ideas
const ideaRouter = express.Router();

ideaRouter.param('ideaId', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);

    if (idea) {
        req.idea = idea;
        next();
    } else {
        res.status(404).send();
    }

});

// GET /api/ideas to get an array of all ideas.
ideaRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');

    if (ideas) {
        res.status(200).send(ideas);
  
    } else {
        res.status(404).send();
    }

});

// POST /api/ideas to create a new idea and save it to the database.
ideaRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;
        addToDatabase('ideas', newIdea);
        res.status(201).send(newIdea);
});

// GET /api/ideas/:ideaId to get a single idea by id.
ideaRouter.get('/:ideaId', (req, res, next) => {
    res.status(200).send(req.idea);
})

// PUT /api/ideas/:ideaId to update a single idea by id.
ideaRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;

    if (!newIdea.name || !newIdea.description || !newIdea.numWeeks || !newIdea.weeklyRevenue) {
        res.status(400).send();
  
    } else {
        const newlyUpdatedIdea = updateInstanceInDatabase('ideas', req.body);
        res.status(202).send(newlyUpdatedIdea);
    }

});

// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideaRouter.delete('/:ideaId', (req, res, next) => {
    
    const isDeleted = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (isDeleted) {
        res.status(204).send();

    } else {
        res.sendStatus(500).send();
    }
});

module.exports = ideaRouter;






