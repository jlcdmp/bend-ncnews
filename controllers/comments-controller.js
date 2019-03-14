const { removeComment } = require('../models/comments-model');

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then((removed) => {
    res.sendStatus(204);
  })
    .catch(err => console.log(err));
};

exports.patchCommentVotes = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  patchComment(article_id, newVote).then((patched) => {
    res.status(204).send({ patched });
  })
    .catch(err => console.log(err));
};
