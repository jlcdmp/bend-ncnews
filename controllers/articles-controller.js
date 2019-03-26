const {
  fetchArticleData,
  addArticle,
  fetchArticleDataByID,
  patchArticle,
  deleteArticle,
  fetchComments,
  addComment,
} = require('../models/articles-model');

const { sortByCheck } = require('./tools');


exports.getArticles = (req, res, next) => {
  const q = req.query;
  if (q.sort_by) {
    if (q.sort_by !== 'created_at' || q.sort_by !== 'votes' || q.sort_by !== 'article_id') {
      res.status(400).send({ message: `Cannot sort_by ${q.sort_by}` });
    }
  } else if (q.author) {
    if (q.author !== 'butter_bridge' && q.author !== 'rogersop' && q.author !== 'icellusedkars') {
      res.status(400).send({ message: `Author ${q.author} does not exsist` });
    } else {
      fetchArticleData(q)
        .then((articles) => {
          if (articles.length === 0) next({ status: 404 });
          else {
            res
              .send({ articles })
              .status(200);
          }
        })
        .catch(next);
    }
  }
};


exports.newArticle = (req, res, next) => {
  // promise.all CAN be used -> using for returning.
  // invalid topic
  const article = req.body;
  addArticle(article)
    .then((newArticle) => {
      res
        .status(201)
        .send({ newArticle });
    })
    .catch(next);
};


exports.getArticleFromID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleDataByID(article_id).then((article) => {
    if (article.length === 0) res.status(404).send({ message: `The article_id ${article_id} does not exists` });
    else {
      res.status(200).send({ article, article_id });
    }
  })
    .catch(next);
};

exports.patchArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  patchArticle(article_id, newVote).then((patched) => {
    if (patched.length === 0) res.status(404).send({ message: `The article_id ${article_id} does not exists` });
    else {
      res.status(202).send({ patched });
    }
  })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id).then((removed) => {
    if (removed === 0) res.status(404).send({ message: `The article_id ${article_id} does not exists` });
    else {
      res.sendStatus(204);
    }
  })
    .catch(next);
};

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ message: `The article_id ${article_id} does not exists` });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch(next);
};

exports.newComment = (req, res, next) => {
  const { article_id } = req.query;
  const comment = req.body;
  addComment(article_id, comment).then((newComment) => {
    res.status(201).send({ newComment });
  })
    .catch(next);
};
