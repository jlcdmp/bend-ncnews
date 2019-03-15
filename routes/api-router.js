const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articleRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const { GetEndpoints } = require('../controllers/endpoint-controller');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/endpoints', GetEndpoints);

module.exports = apiRouter;
