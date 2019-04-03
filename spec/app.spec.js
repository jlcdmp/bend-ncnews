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
        expect(res.body.topics.length).to.equal(2);
        expect(res.body.topics[0]).to.have.keys('slug', 'description');
      }));
    it('POST:201. Uses topic_id to add a new topic object consisting of slug & description', () => request.post('/api/topics')
      .send([{ slug: 'test', description: 'test' }])
      .expect(201)
      .then((res) => {
        expect(res.body.newTopic).to.eql([{ slug: 'test', description: 'test' }]);
      }));
  });
  describe('/articles', () => {
    it('GET:200. Returns an array of objects consisting of author,title,article_id,topic,created_at,votes & body', () => request.get('/api/articles').expect(200)
      .then((res) => {
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles.length).to.equal(12);
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
    it('QUERY: Sort by defualt to date', () => request.get('/api/articles?sort_by=created_at').expect(200)
      .then((res) => {
        expect(res.body.articles[0].article_id).to.equal(12);
        expect(res.body.articles[1].article_id).to.equal(11);
      }));
    it('QUERY: Sory by set to any valid column', () => request.get('/api/articles?sort_by=votes').expect(200)
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
    describe('/:article_id', () => {
      it('GET:200. Returns a single article object consisting of author,title,article_id,body,topic,created_at & votes', () => request.get('/api/articles/1').expect(200)
        .then((res) => {
          expect(res.body.article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
        }));
      it('PATCH:202. Uses article_id to alter the article votes,returns the newly patched article', () => request.patch('/api/articles/2')
        .send({ inc_votes: 1 })
        .expect(202)
        .then((res) => {
          expect(res.body.article.votes).to.equal(1);
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
    });
  });
  describe('/comments/:comment_id', () => {
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
        expect(res.body.users.length).to.equal(3);
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
    describe('/:user_id', () => {
      it('GET:200. Uses username to get a single user object consisting of username, avatar_url, name', () => request.get('/api/users/butter_bridge')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.user[0]).to.have.keys('username', 'avatar_url', 'name');
        }));
    });
  });
  describe('/endpoints', () => {
    it('GET:200. Returns a JSON with all viable endpoints.', () => request.get('/api/api')
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints).to.be.an('object');
        expect(res.body.endpoints).to.eql({
          '/topics': 'Get all topics, post new topic',
          '/articles': 'Get all articles, post new article',
          '/articles/:article_id': 'Get single article by ID, Patch single article by ID, delete single article by ID',
          '/users': 'Get all users, Post new user',
          '/users/:username': 'Get single user by username',
          '/users/:user_id': 'Get single user by ID',
          '/comments/:comment_id': 'Delete comment by ID, Patch comment by ID.',
        });
      }));
  });
  describe('/errors', () => {
    describe('/topics', () => {
      it('GET:404. Returns an appropriate error message and code when trying to accses an invalid route', () => request.get('/api/topic')
        .expect(200)
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('POST:422. Returns appropriate error message and code when posting a topic that aready exists', () => request.post('/api/topics')
        .send({
          slug: 'mitch',
          description: 'this is a description',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Duplicate key value violates unique constraint');
        }));
      it('POST:400. Returns appropriate error message and code when posting a topic with missing feilds', () => request.post('/api/topics')
        .send({
          title: 'slug',
          body: 'description',
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Columns do not exsist');
        }));
    });
    describe('/articles', () => {
      it('GET:404. Returns an appropirate error code and message when passed a non-exsistant route', () => request.get('/api/article')
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('POST:400. Returns appropriate error code and message when posting with invalid article topic/author', () => request.post('/api/articles')
        .send({
          title: 'testing title',
          topic: 'testing topic',
          author: 'testing author',
          body: 'testing body',
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Cannot post with an invlaid author/topic');
        }));
      it('POST:400. Retuns appropriate error code and message when posting with missing feilds ', () => request.post('/api/articles')
        .send({
          body: 'testing body',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Null value in collum viollates non-null contraint');
        }));
      it('QUERY:400. Returns appropriate error code and message when sort_by is invalid', () => request.get('/api/articles?sort_by=test')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Cannot sort_by test');
        }));
      it('QUERY:404 Returns appropriate error code and message when author is invalid', () => request.get('/api/articles?author=test')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('QUERY:400.If order by is set to an inalid collumn name, defualt back to created at', () => request.get('/api/articles?order_by=test')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(12);
        }));
    });
    describe('/article_id', () => {
      it('GET:400. Returns apropriate error code and message when passed an invalid syntax for article_id', () => request.get('/api/articles/cooking')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid input syntax for integer');
        }));
      it('GET:404. Returns an appropriate error code and message when passed an invalid article_id', () => request
        .get('/api/articles/666')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('The article_id 666 does not exists');
        }));
      it('PATCH: 400. Returns appropriate error code and message when patching with invalid syntax ', () => request.patch('/api/articles/1')
        .send({ votes: 'five' })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid input syntax for integer');
        }));
      it('PATCH:404. Returns appropriate error code and message when passed invalid article_id to patch', () => request.patch('/api/articles/666')
        .send({ votes: 100 })
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('The article_id 666 does not exists');
        }));
      it('PATCH:400 Returns appropriate error code and message when patch has invalid body', () => request
        .patch('/api/articles/1')
        .send({ votes: 2, comment: 'test' })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.eql('Columns do not exsist');
        }));
      it('DELETE:404. Returns appropriate error code and message when trying to delete with an invalid article_id', () => request.delete('/api/articles/666')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.eql('The article_id 666 does not exists');
        }));
    });
    describe('/comments', () => {
      it('GET:404. Returns an appropriate error code and message when passed an invalid article_id', () => request.get('/api/articles/666/comments')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('The article_id 666 does not exists');
        }));
      // it('POST:404. Returns an appropriate error code and message when posting to an invalid article_id', () => request.post('/api/articles/666/comments')
      //   .send({
      //     author: 'butter_bridge',
      //     body: 'test',
      //   })
      //   .expect(404)
      //   .then((res) => {
      //     expect(res.body.message).to.equal('The article_id 666 does not exists');
      //   }));
      it('POST:404. Returns appropriate error code and message when trying to comment with an invalid author ', () => request.post('/api/articles/1/comments')
        .send({
          author: 'test',
          body: 'test',
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Cannot post with an invlaid author/topic');
        }));
      it('POST:422. Returns appropriate error code and message when trying to post with missing feilds', () => request.post('/api/articles/1/comments')
        .send({
          body: 'test',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Null value in collum viollates non-null contraint');
        }));
      describe('/:comments_id', () => {
        it('PATCH:404. Returns appropriate error code and message when patch has invalid body', () => request.patch('/api/comments/1')
          .send({ votes: 15, comment: 'test' })
          .then((res) => {
            expect(res.body.message).to.equal('Columns do not exsist');
          }));
        it('PATCH:404. Returns appropriate error code and message when trying to patch to an invalid comment_id', () => request.patch('/api/comments/666')
          .send({ votes: -100 })
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('The comment_id 666 does not exsist');
          }));
        it('DELETE:404. Returns appropriate error code and message when trying to delete with an invalid comment_id', () => request.delete('/api/comments/666')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('The comment_id 666 does not exsist');
          }));
      });
    });
    describe('/users', () => {
      it('GET:404. Returns appropriate error code and message when passed an invalid route ', () => request.get('/api/user')
        .then((res) => {
          expect(res.body.message).to.equal('Page not found');
        }));
      it('POST:400. Returns appropriate error code and message when post body is missing feilds', () => request.post('/api/users')
        .send({
          username: 'test',
          name: 'test',
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('Null value in collum viollates non-null contraint');
        }));
      describe('/:username', () => {
        it('GET:404.Returns appropriate error code and message when invalid passed invalid username', () => request.get('/api/users/test')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('The username test does not exsist');
          }));
      });
    });
  });
});
