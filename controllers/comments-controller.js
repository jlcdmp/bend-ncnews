const { removeComment, patchComment } = require('../models/comments-model');

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then((removed) => {
    if (removed === 0) res.status(404).send({ message: `The comment_id ${comment_id} does not exsist` });
    else {
      res.sendStatus(204);
    }
  })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes === 'string') { next({ code: '22P02' }); }

  if (typeof inc_votes === 'undefined') { next({ code: 42703 }); } else {
    patchComment(comment_id, inc_votes).then(([comment]) => {
      if (comment === undefined) res.status(404).send({ message: `The comment_id ${comment_id} does not exsist` });
      else {
        res.status(202).send({ comment });
      }
    })
      .catch(next);
  }
};
