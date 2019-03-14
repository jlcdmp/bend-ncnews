const { removeComment, patchComment } = require('../models/comments-model');

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then(() => {
    res.sendStatus(204);
  })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const newVote = req.body;
  patchComment(comment_id, newVote).then((patched) => {
    res.status(202).send({ patched });
  })
    .catch(next);
};
