const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const { handle400s, handle404s, handle422s } = require('./error-handling');


app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  res.json({ message: 'Page not found' }).status(404);
});


app.use(handle400s);
app.use(handle422s);
app.use(handle404s);

module.exports = app;
