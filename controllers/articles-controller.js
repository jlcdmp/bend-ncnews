const {
  fetchArticleData,
  addArticle,
  fetchArticleDataByID,
  patchArticle,
  deleteArticle,
  fetchComments,
  addComment,
} = require('../models/articles-model');


exports.getArticles = (req, res, next) => {
  const q = req.query;

  const validSortBy = ['created_at', 'votes', 'article_id', undefined];
  if (!validSortBy.includes(q.sort_by)) {
    return res.status(400).send({ message: `Cannot sort_by ${q.sort_by}` });
  }
  fetchArticleData(q)
    .then((articles) => {
      if (articles.length === 0) res.status(404).send({ message: 'Page not found' });
      else {
        res.send({ articles }).status(200);
      }
    })
    .catch((err) => {
      next(err);
    });
};


exports.newArticle = (req, res, next) => {
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
  fetchArticleDataByID(article_id).then(([article]) => {
    if (article === undefined) res.status(404).send({ message: `The article_id ${article_id} does not exists` });
    else {
      res.status(200).send({ article });
    }
  })
    .catch(next);
};

exports.patchArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticle(article_id, inc_votes).then(([article]) => {
    console.log(article);
    if (article === undefined) res.status(404).send({ message: `The article_id ${article_id} does not exists` });
    else {
      res.status(202).send({ article });
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
