const articleRouter = require('express').Router();
const { getArticles, newArticle } = require('../controllers/articles-controller');


console.log('article router');

articleRouter.get('/', getArticles);
articleRouter.post('/', newArticle);

module.exports = articleRouter;
