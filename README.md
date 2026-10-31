# VYORA — Your Intelligence, Connected.

> Next-Generation Multi-Model AI Assistant Platform featuring Adaptive Intelligence Routing, Grounded Web Research with Live Citations, Document RAG Intelligence, Multi-Model Arena Benchmarking, and User-Approved Personal Memory.

---

## 🌟 Core Modules

1. **Adaptive Intelligence Router**:
   - Parses prompt intent across 9 cognitive categories: `GENERAL_CHAT`, `REASONING`, `CODING`, `WEB_RESEARCH`, `DOCUMENT_ANALYSIS`, `SUMMARIZATION`, `WRITING`, `COMPARISON`, and `DATA_ANALYSIS`.
   - Dispatches tasks to the optimal engine (`gemini-3.8-flash`, `gemini-4-argon`, `gemini-3.1-flash-lite`, `gpt-4o`).
   - Attaches verified routing rationale and executed tool diagnostics to every response.

2. **Web Research Engine**:
   - Native Google Search grounding via Gemini API (`googleSearch: {}`).
   - Retrieves live indexed sources, filters and deduplicates publisher domains.
   - Attaches verifiable URL source cards with direct external links.
   - Generates structured research dossiers with exportable `.md` reports.

3. **Document Intelligence & Semantic RAG**:
   - File upload supporting PDF, TXT, DOCX, and Markdown files.
   - Semantic chunking (250 tokens per chunk with 40-token overlap).
   - In-memory vector indexing and cosine similarity retrieval scoring.
   - Interactive document Q&A grounding responses strictly on cited passages.

4. **Multi-Model Comparison Arena**:
   - Broadcasts identical prompts simultaneously to 2 or 3 models.
   - Measures latency in milliseconds and tracks input/output token metrics.
   - Side-by-side comparative inspection with independent copy and retry controls.

5. **User-Approved Personal Memory System**:
   - Strict consent-first privacy architecture: facts are never silently stored.
   - Categorized into Preferences, Projects, Communication, Context, and Custom.
   - Per-item approval switches and global memory pause toggle.
   - Formats approved knowledge into system instructions without overriding explicit prompt directives.

6. **Settings, Usage, & Zero-Retention Privacy**:
   - Full JSON workspace export archive.
   - Permanent one-click local storage purge.
   - Telemetry tracker calculating token consumption and cost estimates.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Marked GFM renderer.
- **Backend**: Express server (`server.ts`) hosting secure API proxy routes with Vite dev middleware.
- **AI SDK**: Official `@google/genai` TypeScript SDK (server-side only, `process.env.GEMINI_API_KEY`).
- **Testing**: Node.js test runner (`node:test`, `node:assert/strict`) executed via `npx --yes tsx --test`.
- **E2E Browser Automation**: Headless Chromium verified via Playwright CLI (`playwright-cli`).

---

## 🗄️ Database Schema & SQL Migration Guide (Supabase / PostgreSQL)

For production deployment with PostgreSQL + pgvector, use the following relational schema:

```sql
-- Enable UUID and vector extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. User Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plan TEXT DEFAULT 'pro',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model_id TEXT NOT NULL,
  auto_routing BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  task_category TEXT,
  citations JSONB DEFAULT '[]'::jsonb,
  routing_decision JSONB,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Documents & Semantic Chunks
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  summary TEXT,
  status TEXT DEFAULT 'ready',
  raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- 5. Personal Memories
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Preferences', 'Projects', 'Communication', 'Context', 'Custom')),
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
```

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```bash
   GEMINI_API_KEY="your_api_key_here"
   PORT=3000
   ```

3. Run unit test suite:
   ```bash
   npx --yes tsx --test src/lib/ai/router.test.ts src/lib/documents/rag.test.ts src/lib/memory/memory.test.ts
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
