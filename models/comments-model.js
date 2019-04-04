const connection = require('../db/connection');

exports.removeComment = comment_id => connection('comments')
  .where('comment_id', '=', comment_id)
  .del();

exports.patchComment = (comment_id, inc_votes) => connection('comments')
  .where('comment_id', '=', comment_id)
  .increment('votes', inc_votes)
  .returning('*');
