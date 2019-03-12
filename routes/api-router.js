const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articleRouter = require('./articles-router');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

console.log('api router');

module.exports = apiRouter;
