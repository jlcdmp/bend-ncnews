const { fetchArticleData, addArticle } = require('../models/articles-model');

console.log('articles controller');

exports.getArticles = (req, res, next) => {
  const q = req.query;
  fetchArticleData(q).then((articles) => {
    res.send(articles).status(200);
  })
    .catch(err => console.log(err));
};

exports.newArticle = (req, res, next) => {
  const article = req.body;
  console.log(article);
  addArticle(article).then((newArticle) => {
    console.log(newArticle);
    res.status(201).send(newArticle);
  })
    .catch(err => console.log(err));
};
