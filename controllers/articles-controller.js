const {
  fetchArticleData,
  addArticle,
  fetchArticleDataByID,
  patchArticle,
  deleteArticle,
  fetchComments,
  addComment,
  commentCount,
} = require('../models/articles-model');


exports.getArticles = (req, res, next) => {
  const q = req.query;
  fetchArticleData(q).then((articles) => {
    res.send({ articles }).status(200);
  })
    .catch(err => console.log(err));
};

exports.newArticle = (req, res, next) => {
  const article = req.body;
  addArticle(article).then((newArticle) => {
    res.status(201).send({ newArticle });
  })
    .catch(next);
};

exports.getArticleFromID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleDataByID(article_id).then((article) => {
    res.status(200).send({ article, article_id });
  })
    .catch(next);
};

exports.patchArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  patchArticle(article_id, newVote).then((patched) => {
    res.status(202).send({ patched });
  })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id).then(() => {
    res.sendStatus(204);
  })
    .catch(next);
};

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
      //  console.log(comments);
    })
    .catch(next);
};

exports.newComment = (req, res, next) => {
  const { article_id } = req.query;
  const comment = req.body;

  addComment(article_id, comment).then((newComment) => {
    res.status(201).send({ newComment });
  })
    .catch(err => console.log(err));
};
