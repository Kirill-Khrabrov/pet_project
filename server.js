const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;

// Middleware for handling CORS requests from index.html
const cors = require('cors');
app.use(cors());

// Logging middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// Middware for parsing request bodies here:
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Mounting existing apiRouter below at the '/api' path.
const apiRouter = require('./server/apiRouter');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`${PORT} is listening`);
});

module.exports = app;
