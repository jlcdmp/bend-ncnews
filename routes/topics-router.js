const topicsRouter = require('express').Router();
const { getTopics, newTopic } = require('../controllers/topics-controller');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', newTopic);


module.exports = topicsRouter;
