
const {
  topicData, userData, articleData, commentData,
} = require('../data');

const { formatTimeStamp, titleArticleID, formatComment } = require('../utils');

exports.seed = (knex, promise) => knex.migrate
  .rollback()
  .then(() => knex.migrate.latest())
  .then(() => knex('topics')
    .insert(topicData)
    .returning('*'))
  .then(() => knex('users')
    .insert(userData)
    .returning('*'))
  .then(() => knex('articles')
    .insert(formatTimeStamp(articleData))
    .returning('*'))
  .then((articleRows) => {
    const refObj = titleArticleID(articleRows);
    const formattedComments = formatComment(commentData, refObj);
    return knex('comments')
      .insert(formattedComments);
  });
