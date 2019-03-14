const connection = require('../db/connection');

exports.removeComment = comment_id => connection('comments')
  .where('comment_id', '=', comment_id)
  .del();
