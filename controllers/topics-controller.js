const { fetchTopicData, addTopic } = require('../models/topics-model');


exports.getTopics = (req, res, next) => {
  fetchTopicData().then((topics) => {
    res.send({ topics }).status(200);
  })
    .catch(next);
};

exports.newTopic = (req, res, next) => {
  const topic = req.body;
  addTopic(topic).then((newTopic) => {
    res.status(201).send({ newTopic });
  })
    .catch(next);
};
