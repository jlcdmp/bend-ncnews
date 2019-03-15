const connection = require('../db/connection');


exports.fetchArticleData = (query) => {
  const knexQuery = connection
    .select('articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .orderBy('articles.created_at', 'asc');


  if (query.hasOwnProperty('author') === true) {
    knexQuery.where('articles.author', query.author);
  }
  if (query.hasOwnProperty('topic') === true) {
    knexQuery.where('articles.topic', query.topic);
  }
  if (query.sortby === 'votes') {
    knexQuery.orderBy('articles.votes', 'asc');
  } else if (query.sortby !== 'topic') {
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


exports.patchArticle = (article_id, newVote) => connection('articles')
  .update(newVote)
  .where('article_id', '=', article_id)
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
