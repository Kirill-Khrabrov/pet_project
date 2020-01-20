const express = require('express');
const apiRouter = express.Router();

// mounting Routers on URLs
const tripRouter = require('./Routers/tripRouter');
apiRouter.use('/trip', tripRouter);

const spendingsRouter = require('./Routers/spendingsRouter');
apiRouter.use('/spendings', spendingsRouter);



module.exports = apiRouter;
