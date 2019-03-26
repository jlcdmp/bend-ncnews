const topicsRouter = require('express').Router();
const { getTopics, newTopic } = require('../controllers/topics-controller');


topicsRouter.route('/')
  .get(getTopics)
  .post(newTopic);

module.exports = topicsRouter;
