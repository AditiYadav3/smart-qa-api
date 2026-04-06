const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Document = require('../models/Document');

jest.mock('../services/ragService', () => ({
  ...jest.requireActual('../services/ragService'),
  answerQuestion: jest.fn(),
}));

const { answerQuestion } = require('../services/ragService');

let mongod;
let token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Seed a doc for retrieval
  await Document.create({
    title: 'Refund Policy',
    content: 'Refunds are processed within 5-7 business days.',
    tags: ['refund'],
  });

  // Register + login to get token
  await request(app).post('/api/auth/register').send({ email: 'test@example.com', password: 'password123' });
  const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(() => jest.clearAllMocks());

describe('POST /api/ask', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/ask').send({ question: 'What is the refund policy?' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when question is missing', async () => {
    const res = await request(app)
      .post('/api/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 200 with structured answer', async () => {
    answerQuestion.mockResolvedValue({
      answer: 'Refunds take 5-7 business days.',
      sources: ['Refund Policy'],
      confidence: 0.85,
      latencyMs: 300,
    });

    const res = await request(app)
      .post('/api/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'What is the refund policy?' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('answer');
    expect(res.body).toHaveProperty('sources');
    expect(res.body).toHaveProperty('confidence');
  });

  it('returns 502 when LLM returns invalid response', async () => {
    const err = new Error('LLM returned an invalid response');
    err.status = 502;
    answerQuestion.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'What is the refund policy?' });

    expect(res.status).toBe(502);
  });
});

describe('GET /api/ask/history', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/ask/history');
    expect(res.status).toBe(401);
  });

  it('returns 200 with history array', async () => {
    const res = await request(app)
      .get('/api/ask/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.history)).toBe(true);
  });
});
