const connection = require('../db/connection');


exports.fetchTopicData = () => connection
  .select('*')
  .from('topics');

exports.addTopic = topic => connection('topics')
  .insert(topic)
  .returning('*');
