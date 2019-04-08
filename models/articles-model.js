const connection = require('../db/connection');


exports.fetchArticleData = (query) => {
  const { sort_by, order, author } = query;


  return connection('articles')
    .select('articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .orderBy(sort_by || 'created_at', order)
    .modify((query) => {
      if (author) query.where('articles.author', author);
    });
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


exports.addComment = comment => connection('comments')
  .insert(comment)
  .returning('*');
