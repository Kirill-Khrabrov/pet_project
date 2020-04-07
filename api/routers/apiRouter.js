const express = require('express');
const apiRouter = express.Router();

// mounting TripRouters on URLs
const tripsRouter = require('./tripsRouter');
apiRouter.use('/trips', tripsRouter);

module.exports = apiRouter;
