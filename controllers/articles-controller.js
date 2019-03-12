const {
  fetchArticleData,
  addArticle,
  fetchArticleDataByID,
  patchArticle,
  deleteArticle,
  fetchComments,
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
  const newVote = req.body;
  patchArticle(article_id, newVote).then((patched) => {
    res.status(202).send(patched);
  })
    .catch(err => console.log(err));
};

exports.removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id).then((removed) => {
    res.sendStatus(204);
  })
    .catch(err => console.log(err));
};

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id).then((comments) => {
    res.status(200).send(comments);
  })
    .catch(err => console.log(err));
};
