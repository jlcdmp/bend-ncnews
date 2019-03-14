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


articleRouter.get('/', getArticles);
articleRouter.post('/', newArticle);
articleRouter.get('/:article_id', getArticleFromID);
articleRouter.patch('/:article_id', patchArticleVote);
articleRouter.delete('/:article_id', removeArticle);
articleRouter.get('/:article_id/comments', getCommentsByID);
articleRouter.post('/:article_id/comments', newComment);

module.exports = articleRouter;
