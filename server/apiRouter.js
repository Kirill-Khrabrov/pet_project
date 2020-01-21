const express = require('express');
const apiRouter = express.Router();

// mounting Routers on URLs
const tripsRouter = require('./Routers/tripsRouter');
apiRouter.use('/trips', tripsRouter);

const spendingsRouter = require('./Routers/spendingsRouter');
apiRouter.use('/spendings', spendingsRouter);



module.exports = apiRouter;
