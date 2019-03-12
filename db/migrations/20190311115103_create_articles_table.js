exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    // console.log(typeof articlesTable);
    articlesTable
      .increments('article_id')
      .primary();
    articlesTable
      .string('title')
      .notNullable();
    articlesTable
      .text('body', 500)
      .notNullable();
    articlesTable
      .integer('votes')
      .defaultsTo(0);
    articlesTable
      .string('topic');
    articlesTable
      .foreign('topic')
      .references('slug')
      .inTable('topics')
      .onDelete('CASCADE');
    articlesTable
      .string('author');
    articlesTable
      .foreign('author')
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    articlesTable
      .timestamp('created_at')
      .defaultTo(knex.fn.now());
  });
};


exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
