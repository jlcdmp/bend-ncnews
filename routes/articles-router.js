const articleRouter = require('express').Router();

const {
  getArticles,
  newArticle,
  getArticleFromID,
  patchArticleVote,
  removeArticle,
  getCommentsByID,
  newComment,
} = require('../controllers/articles-controller');


articleRouter.route('/')
  .get(getArticles)
  .post(newArticle);

articleRouter.route('/:article_id')
  .get(getArticleFromID)
  .patch(patchArticleVote)
  .delete(removeArticle);

articleRouter.route('/:article_id/comments')
  .get(getCommentsByID)
  .post(newComment);

module.exports = articleRouter;
