process.env.NODE_ENV = 'test';

const { expect } = require('chai');

const supertest = require('supertest');

const app = require('../app');

const request = supertest(app);

const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET:200. Retuns an array of topic object consisting of slug & description.', () => request.get('/api/topics').expect(200)
      .then((res) => {
        expect(res.body.topics).to.be.an('array');
        expect(res.body.topics[0]).to.have.keys('slug', 'description');
      }));
    it('POST:201. Uses topic_id to add a new topic object consisting of slug & description', () => request.post('/api/topics')
      .send([{ slug: 'test', description: 'test' }])
      .expect(201)
      .then((res) => {
        expect(res.body.newTopic).to.eql([{ slug: 'test', description: 'test' }]);
      }));
    describe('/errors', () => {
      it('GET:404. Returns an appropriate error message and code when passed a non-exsistant route', () => request.get('/api/topic')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));

      it('POST:422. Returns an apppropriate error code and message when passed a body that already exsists', () => request.post('/api/topics')
        .send({
          slug: 'mitch',
          description: 'this is a description',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Duplicate key value violates unique constraint');
        }));

      it('POST:400. Returns an appropriate error code and message when passed an incorrect body', () => request.post('/api/topics')
        .send({
          title: 'slug',
          body: 'description',
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Columns do not exsist');
        }));
    });
  });
  describe('/articles', () => {
    it('GET:200. Returns an array of objects consisting of author,title,article_id,topic,created_at,votes & body', () => request.get('/api/articles').expect(200)
      .then((res) => {
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'body', 'comment_count');
      }));
    it('QUERY: Filter by authors', () => request.get('/api/articles?author=icellusedkars').expect(200)
      .then((res) => {
        expect(res.body.articles[0].author).to.equal('icellusedkars');
        expect(res.body.articles[1].author).to.equal('icellusedkars');
      }));
    it('QUERY: Filter by topics', () => request.get('/api/articles?topic=mitch').expect(200)
      .then((res) => {
        expect(res.body.articles[0].topic).to.equal('mitch');
        expect(res.body.articles[1].topic).to.equal('mitch');
      }));
    it('QUERY: Sort by defualt to date', () => request.get('/api/articles?sortby=created_at').expect(200)
      .then((res) => {
        expect(res.body.articles[0].created_at).to.equal('1974-11-26T12:21:54.000Z');
      }));
    it('QUERY: Sory by set to any valid column', () => request.get('/api/articles?sortby= votes').expect(200)
      .then((res) => {
        expect(res.body.articles[0].votes).to.equal(0);
      }));
    it('POST:201. uses article_id to add a new article object consisting of title,body,topic & author', () => request.post('/api/articles')
      .send({
        title: 'test title',
        body: 'test body',
        topic: 'mitch',
        author: 'butter_bridge',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.newArticle[0]).to.have.any.keys('title', 'body', 'topic', 'author');
      }));
    it('GET:200. Retuns a single article object consisting of author,title,article_id,body,topic,created_at & votes', () => request.get('/api/articles/1').expect(200)
      .then((res) => {
        expect(res.body.article).to.be.an('array');
        expect(res.body.article[0]).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
      }));
    it('PATCH:202. Uses article_id to alter the article votes,returns the newly patched article', () => request.patch('/api/articles/1')
      .send({ votes: 5 })
      .expect(202)
      .then((res) => {
        expect(res.body.patched[0].votes).to.equal(5);
      }));
    it('DELETE:204. Uses article_id to remove a single article from the database', () => request.delete('/api/articles/1')
      .expect(204)
      .then((res) => {
        expect(res.body).to.eql({});
        expect(res.status).to.equal(204);
      }));
    it('GET:200. Uses article_id to return an array of comments consisting of comment_id,votes, created_at,author & body', () => request.get('/api/articles/1/comments')
      .expect(200)
      .then((res) => {
        expect(res.body.comments).to.be.an('array');
        expect(res.body.comments[0]).to.have.any.keys('comment_id', 'votes', 'created_at', 'author', 'body');
      }));
    it('POST:201. Uses article_id to add a new comment object cosisting of comment_id, votes, created_at, author', () => request.post('/api/articles/1/comments')
      .send({
        author: 'icellusedkars',
        article_id: 1,
        votes: 0,
        body: 'test',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.newComment[0]).to.have.any.keys('comment_id, votes, created_at', 'author');
      }));
    describe.only('/errors', () => {
      it('GET:404. Returns an appropirate error code and message when passed a non-exsistant route', () => request.get('/api/article')
        .expect(404)
        .then((res) => {
          console.log(res.body);
          expect(res.body.message).to.equal('Page not found');
        }));
      it('GET:400. Returns an appropriate error code and message when passed inccorect syntax for article_id"', () => request.get('/api/articles/cooking')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid input syntax for integer');
        }));
      it('GET:404. Returns an appropriate error code and message when passed an invalid article_id', () => request.get('/api/articles/666')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('POST:422. Returns an apppropriate error code and message when passed a body that already exsists', () => request.post('/api/topics')
        .send({
          slug: 'mitch',
          description: 'this is a description',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Duplicate key value violates unique constraint');
        }));
      it('POST:400. Returns appropriate error message and code when passed incorrect body', () => request.post('/api/articles')
        .send({
          t: 'test title',
          b: 'test body',
          tt: 'mitch',
          a: 'butter_bridge',
        })
        .then((res) => {
          expect(res.body.message).to.equal('Columns do not exsist');
        }));
      it('POST:400. Retuns appropriate error message and code when missing data in body', () => request.post('/api/articles')
        .send({ title: 'title' })
        .then((res) => {
          expect(res.body.message).to.equal('Null value in collum viollates non-null contraint');
        }));
      it('PATCH: 400. Returns appropriate error message and code when passed invalid syntax ', () => request.patch('/api/articles/1')
        .send({ votes: 'five' })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid input syntax for integer');
        }));
      it('PATCH:404. Returns appropriate error message and code when passed invalid article_id to patch', () => request.patch('/api/articles/666')
        .send({ votes: 100 })
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('DELETE:404. Returns appropriate error message and code when passed an invalid article_id', () => {
        return request.delete('/api/articles/666')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('Page not found');
          });
      });
    });
  });
  describe('/comments', () => {
    it('PATCH:202. Uses comment_id to alter the comment votes, returns the newly patched comment ', () => request.patch('/api/comments/1')
      .send({ votes: -999 })
      .expect(202)
      .then((res) => {
        expect(res.body.patched[0].votes).to.equal(-999);
      }));
    it('DELETE:204. Uses comment_id to remove a single comment form the database', () => request.delete('/api/comments/1')
      .expect(204)
      .then((res) => {
        expect(res.body).to.eql({});
        expect(res.status).to.equal(204);
      }));
  });
  describe('/users', () => {
    it('GET:200. Returns an array of user objects consisting of username, avatar_url & name', () => request.get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body.users).to.be.an('array');
      }));
    it('POST:201. Adds new user object consisting of username avatar_url & name ', () => request.post('/api/users')
      .send({
        username: 'test',
        avatar_url: 'test',
        name: 'test',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.newUser).to.be.an('array');
        expect(res.body.newUser[0]).to.have.keys('username', 'avatar_url', 'name');
      }));
    it('GET:200. Uses username to get a single user object consisting of username, avatar_url, name', () => request.get('/api/users/butter_bridge')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.user[0]).to.have.keys('username', 'avatar_url', 'name');
      }));
  });
  describe('/endpoints', () => {
    it('GET:200. Returns a JSON with all viable endpoints.', () => request.get('/api/endpoints')
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints).to.be.an('object');
        expect(res.body.endpoints).to.eql({
          '/api/topics': 'Get all topics, post new topic',
          '/api/articles': 'Get all articles, post new article',
          'api/articles/:article_id': 'Get single article by ID, Patch single article by ID, delete single article by ID',
          'api/users': 'Get all users, Post new user',
          'api/users/:username': 'Get single user by username',
          'api/users/:user_id': 'Get single user by ID',
          'api/comments/:comment_id': 'Delete comment by ID, Patch comment by ID.',
        });
      }));
  });
});
