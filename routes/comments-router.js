const commentsRouter = require('express').Router();

const { removeCommentByID, patchCommentVotes } = require('../controllers/comments-controller');

commentsRouter.route('/:comment_id')
  .delete(removeCommentByID)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
