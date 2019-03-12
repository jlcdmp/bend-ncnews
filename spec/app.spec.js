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
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.keys('slug', 'description');
      }));
    it('POST:201. Uses topic_id to add a new topic object consisting of slug & description', () => request.post('/api/topics')
      .send([{ slug: 'politics', description: 'old lady bets countries youths future on black...no red...no black...' }])
      .expect(201)
      .then((res) => {
        expect(res.body).to.eql([{ slug: 'politics', description: 'old lady bets countries youths future on black...no red...no black...' }]);
      }));
  });
  describe('/articles', () => {
    it('GET:200. Returns an array of objects consisting of author,title,article_id,topic,created_at,votes & body', () => request.get('/api/articles').expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'body');
      }));
    it('QUERY: Filter by authors', () => request.get('/api/articles?author=icellusedkars').expect(200)
      .then((res) => {
        expect(res.body[0].author).to.equal('icellusedkars');
        expect(res.body[1].author).to.equal('icellusedkars');
      }));
    it('QUERY: Filter by topics', () => request.get('/api/articles?topic=mitch').expect(200)
      .then((res) => {
        expect(res.body[0].topic).to.equal('mitch');
        expect(res.body[1].topic).to.equal('mitch');
      }));
    it('QUERY: Sort by defualt to date', () => request.get('/api/articles?sortby=created_at').expect(200)
      .then((res) => {
        expect(res.body[0].created_at).to.equal('1974-11-26T12:21:54.000Z');
      }));
    it('QUERY: Sory by set to any valid column', () => request.get('/api/articles?sortby= votes').expect(200)
      .then((res) => {
        expect(res.body[0].votes).to.equal(0);
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
        expect(res.body[0]).to.have.any.keys('title', 'body', 'topic', 'author');
      }));
    it('GET:200. Retuns a single article object consisting of author,title,article_id,body,topic,created_at & votes', () => request.get('/api/articles/1').expect(200)
      .then((res) => {
        expect(res.body[0]).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
      }));
    it('PATCH:202. Uses article_id to alter the article votes,retuns the newly patched article', () => request.patch('/api/articles/1')
      .send({ votes: 5 })
      .expect(202)
      .then((res) => {
        expect(res.body[0].votes).to.equal(5);
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
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body');
      }));
  });
});
