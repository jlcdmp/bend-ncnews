const articleRouter = require('express').Router();
const {
  getArticles, newArticle, getArticleFromID, patchArticleVote,
} = require('../controllers/articles-controller');


console.log('article router');

articleRouter.get('/', getArticles);
articleRouter.post('/', newArticle);
articleRouter.get('/:article_id', getArticleFromID);
articleRouter.patch('/:article_id', patchArticleVote);

module.exports = articleRouter;
