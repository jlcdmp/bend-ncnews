const commentsRouter = require('express').Router();

const { removeCommentByID, patchCommentVotes } = require('../controllers/comments-controller');

commentsRouter.delete('/:comment_id', removeCommentByID);
commentsRouter.patch('/:comment_id', patchCommentVotes);

module.exports = commentsRouter;
