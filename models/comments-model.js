const connection = require('../db/connection');

exports.removeComment = comment_id => connection('comments')
  .where('comment_id', '=', comment_id)
  .del();

exports.patchComment = (comment_id, newVote) => connection('comments')
  .update(newVote)
  .where('comment_id', '=', comment_id)
  .returning('*');
