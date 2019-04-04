const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./routes/api-router');
const {
  handle400s, handle404s, handle422s, handle500s,
} = require('./error-handling');


app.use(bodyParser.json());

app.use(cors());


app.use('/api', apiRouter);


app.use('/*', (req, res, next) => {
  res.json({ message: 'Page not found' }).status(404);
});


app.use(handle400s);
app.use(handle422s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
