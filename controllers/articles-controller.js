const {
  fetchArticleData, addArticle, fetchArticleDataByID, patchArticle,
} = require('../models/articles-model');

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
  addArticle(article).then((newArticle) => {
    res.status(201).send(newArticle);
  })
    .catch(err => console.log(err));
};

exports.getArticleFromID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleDataByID(article_id).then((article) => {
    res.status(200).send(article);
  })
    .catch(err => console.log(err));
};

exports.patchArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  patchArticle(article_id).then((patched) => {
    res.status(204).send(patched);
  })
    .catch(err => console.log(err));
};
