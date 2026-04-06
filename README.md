# Smart Q&A API

A Node.js/Express backend that answers natural language questions using a RAG (Retrieval-Augmented Generation) pipeline backed by MongoDB and a Groq LLM.

## Architecture

```
Request → JWT Auth → Rate Limiter → RAG Pipeline → Structured JSON Response
                                        ↓
                          MongoDB text search (top-N docs)
                                        ↓
                          LangChain PromptTemplate + Groq LLM
                                        ↓
                          Zod-validated { answer, sources, confidence }
```

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Groq API key (free tier at https://console.groq.com)

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

3. Seed the knowledge base:

```bash
npm run seed
```

4. Start the server:

```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-qa-api` |
| `JWT_SECRET` | Secret for signing JWTs | required |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `GROQ_API_KEY` | Groq API key | required |
| `LLM_MODEL` | Groq model name | `llama3-8b-8192` |
| `TOP_N_DOCS` | Number of docs to retrieve | `3` |
| `NODE_ENV` | Environment | `development` |

## Running Tests

```bash
npm test
```

## API Endpoints

### POST /api/auth/register

Register a new user.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

Response:
```json
{ "message": "User created", "user": { "id": "...", "email": "user@example.com" } }
```

### POST /api/auth/login

Login and receive a JWT.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

Response:
```json
{ "token": "eyJhbGci..." }
```

### GET /api/docs

List all documents in the knowledge base.

```bash
curl http://localhost:3000/api/docs
```

### POST /api/ask

Ask a question (requires JWT).

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"question": "What is the refund policy?"}'
```

Response:
```json
{
  "answer": "Refunds are processed within 5-7 business days...",
  "sources": ["Refund Policy"],
  "confidence": 0.85
}
```

### GET /api/ask/history

Get your last 10 Q&A pairs (requires JWT).

```bash
curl http://localhost:3000/api/ask/history \
  -H "Authorization: Bearer <your_token>"
```

## Docker

Run the full stack (API + MongoDB) with Docker Compose:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`. Seed the database after startup:

```bash
docker-compose exec app npm run seed
```
