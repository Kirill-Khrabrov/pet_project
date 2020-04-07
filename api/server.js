const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;

//Enable CORS
const cors = require('cors');
app.use(cors());

//Enable body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Mounting existing apiRouter below at the '/api' path.
const apiRouter = require('./routers/apiRouter.js');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`${PORT} is listening`);
});

module.exports = app;
