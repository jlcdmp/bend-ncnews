const connection = require('../db/connection');


exports.fetchArticleData = (query) => {
  const knexQuery = connection
    .select('articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .orderBy('articles.created_at', 'asc');

  if (query.author) {
    knexQuery.where('articles.author', query.author);
  } else if (query.topic) {
    knexQuery.where('articles.topic', query.topic);
  }
  if (query.sort_by === 'votes') {
    knexQuery.orderBy('articles.votes', 'asc');
  } else if (query.sort_by === 'topic') {
    knexQuery.orderBy('articles.topic', 'asc');
  }
  return knexQuery;
};

exports.addArticle = article => connection('articles')
  .insert(article)
  .returning('*');


exports.fetchArticleDataByID = article_id => connection('articles')
  .where('article_id', '=', article_id)
  .returning('*');


exports.patchArticle = (article_id, inc_votes) => connection('articles')
  .where('article_id', '=', article_id)
  .increment('votes', inc_votes)
  .returning('*');

exports.deleteArticle = article_id => connection('articles')
  .where('article_id', '=', article_id)
  .del();

exports.fetchComments = article_id => connection('comments')

  .select('*')
  .where('article_id', '=', article_id);


exports.addComment = (article_id, comment) => connection('comments')
  .insert(comment)
  .returning('*');
