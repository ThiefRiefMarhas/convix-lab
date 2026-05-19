# CONVIX IDEA LAB — ADVANCE ROADMAP
### Dokumen Strategi Teknis & Rencana Implementasi Lengkap

> **Tanggal**: 19 Mei 2026  
> **Status**: Planning Phase  
> **Scope**: Full AI Engine Integration, Database Architecture, Real-time Streaming, Research Canvas

---

## 📋 RINGKASAN PERMINTAAN USER

### Apa yang diminta:

1. **Database lengkap** di Supabase — untuk conversation, user profile, file upload, dengan batasan-batasan (limit PDF, limit message, dll)
2. **Integrasi OpenRouter API** — menggunakan Gemini 3.1 sebagai model AI utama, konfigurasi di `.env`
3. **Integrasi Tavily** — untuk search web secara real-time sebagai tool AI
4. **Web Scraping** — menggunakan Cheerio untuk extract konten dari URL yang ditemukan
5. **Streaming response** — AI harus merespons secara real-time (token by token), bukan simulasi
6. **Split-screen UI** — Kiri: Chat AI, Kanan: Research Canvas (URL/link yang AI temukan)
7. **Research Canvas** — Menampilkan URL-URL yang AI ambil dalam bentuk card yang saling terhubung, bisa diklik
8. **Sidebar auto-collapse** — Sidebar minimize saat user mulai chat
9. **Model selector** — Pilihan model AI di input area
10. **File attachment** — Upload PDF/image untuk konteks AI
11. **Web search toggle** — Tombol untuk langsung trigger pencarian web
12. **Function calling** — AI bisa memutuskan kapan harus pakai Tavily atau scraping
13. **Conversation persistence** — Semua chat tersimpan di database, bisa diakses lagi

---

## 🏗️ ARSITEKTUR SAAT INI (BEFORE)

### Current State Analysis:

```
FRONTEND (React + Vite + TailwindCSS 4)
├── Landing Page (Home/Features/About/Pricing/Contact) ✅ Selesai, premium
├── Dashboard /app
│   ├── Sidebar dengan hardcoded history ❌ Tidak real
│   ├── Input area + questionnaire flow ✅ UI bagus
│   ├── Chat view ❌ SIMULASI (hardcoded text, character-by-character)
│   └── No research canvas ❌ Belum ada
│
BACKEND (Express + server.ts)
├── POST /api/analyze-market ❌ Pakai @google/generative-ai langsung, bukan OpenRouter
├── POST /api/upload-analysis ❌ Basic file upload, no streaming
├── No streaming endpoint ❌
├── No function calling ❌
├── No conversation management ❌
├── Tavily SDK installed tapi TIDAK DIPAKAI ❌
├── Cheerio installed tapi TIDAK DIPAKAI ❌
│
DATABASE (Supabase)
├── auth.users ✅ Login Google/GitHub/Email OTP works
├── profiles table ❌ Tidak ada
├── conversations table ❌ Tidak ada
├── messages table ❌ Tidak ada
├── research_sources table ❌ Tidak ada
└── file_uploads table ❌ Tidak ada
```

### Diagnosa Utama:
- **Chat AI itu 100% simulasi** — tidak ada koneksi ke AI model apapun dari Dashboard
- **Tavily dan Cheerio sudah diinstall** tapi tidak ada satu baris kode pun yang memakainya
- **Database kosong** — hanya ada Supabase Auth, tidak ada tabel untuk data aplikasi
- **Server.ts monolitik** — semua logic di satu file 99 baris, tidak modular

---

## 🎯 ARSITEKTUR TARGET (AFTER)

```
FRONTEND (React + Vite + TailwindCSS 4)
├── Landing Page ✅ (tidak diubah)
├── Dashboard /app
│   ├── Sidebar
│   │   ├── Real conversation history dari DB
│   │   ├── Auto-collapse saat mulai chat
│   │   ├── New Intelligence = buat conversation baru
│   │   └── Click item = load conversation dari DB
│   ├── Input View (initial state)
│   │   ├── Model selector (Pro/Fast/Creative)
│   │   ├── File attachment (PDF/Image)
│   │   ├── Web search toggle
│   │   └── Template cards
│   ├── Chat Panel (left, 55%)
│   │   ├── Real streaming dari OpenRouter via SSE
│   │   ├── Markdown rendering
│   │   ├── Tool call status cards inline
│   │   ├── Stop generation button
│   │   └── Multi-turn conversation
│   └── Research Canvas (right, 45%)
│       ├── URL cards grouped by search query
│       ├── Connection lines antar related cards
│       ├── Click to open URL
│       ├── Expandable card untuk lihat full content
│       └── Filter/search sources
│
BACKEND (Express, modular)
├── server.ts (thin orchestrator)
├── server/routes/
│   ├── chat.ts      → POST /api/chat (SSE streaming)
│   ├── conversations.ts → CRUD conversations
│   └── upload.ts    → File upload ke Supabase Storage
├── server/services/
│   ├── openrouter.ts   → OpenRouter API client
│   ├── tavily.ts       → Tavily search wrapper
│   ├── scraper.ts      → Cheerio web scraper
│   └── supabase-admin.ts → Server-side Supabase client
├── server/middleware/
│   └── auth.ts → JWT validation middleware
└── server/prompts/
    └── system.ts → AI system prompt + tool definitions
│
DATABASE (Supabase)
├── auth.users ✅
├── profiles (display_name, avatar, plan_tier, created_at)
├── conversations (user_id, title, model, status, message_count)
├── messages (conversation_id, role, content, metadata JSONB)
├── research_sources (conversation_id, message_id, url, title, content, score)
├── file_uploads (user_id, conversation_id, file_name, file_type, size, storage_path)
├── user_usage (user_id, messages_today, searches_today, files_total)
├── RLS policies on ALL tables
├── Indexes on hot columns
└── Storage bucket: user-uploads (10MB limit)
```

---

## 📊 DATABASE DESIGN — DETAIL LENGKAP

### Table: `profiles`
```sql
-- Auto-created on signup via trigger
id              UUID PRIMARY KEY (references auth.users)
display_name    TEXT
avatar_url      TEXT
plan_tier       TEXT DEFAULT 'beta' -- 'beta', 'pro', 'enterprise'
max_conversations INTEGER DEFAULT 20
max_messages_per_convo INTEGER DEFAULT 50
max_files_per_convo INTEGER DEFAULT 5
max_file_size_mb INTEGER DEFAULT 10
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

### Table: `conversations`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES auth.users ON DELETE CASCADE
title           TEXT -- Auto-generated dari first message
model           TEXT DEFAULT 'Convix Fast'
status          TEXT DEFAULT 'active' -- 'active', 'archived'
message_count   INTEGER DEFAULT 0
source_count    INTEGER DEFAULT 0
last_message_at TIMESTAMPTZ
created_at      TIMESTAMPTZ DEFAULT now()
```

### Table: `messages`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID REFERENCES conversations ON DELETE CASCADE
user_id         UUID REFERENCES auth.users ON DELETE CASCADE
role            TEXT CHECK (role IN ('user', 'assistant', 'system', 'tool'))
content         TEXT
metadata        JSONB DEFAULT '{}'
  -- metadata berisi:
  -- untuk assistant: { model, tokens_used, finish_reason }
  -- untuk tool: { tool_name, tool_input, tool_output }
  -- untuk user: { attachments: [file_id, ...] }
created_at      TIMESTAMPTZ DEFAULT now()
```

### Table: `research_sources`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID REFERENCES conversations ON DELETE CASCADE
message_id      UUID REFERENCES messages ON DELETE SET NULL
user_id         UUID REFERENCES auth.users ON DELETE CASCADE
url             TEXT NOT NULL
title           TEXT
domain          TEXT
snippet         TEXT
full_content    TEXT
relevance_score FLOAT
source_type     TEXT DEFAULT 'tavily' -- 'tavily', 'scrape', 'user_provided'
search_query    TEXT -- query yang dipakai untuk menemukan URL ini
created_at      TIMESTAMPTZ DEFAULT now()
```

### Table: `file_uploads`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES auth.users ON DELETE CASCADE
conversation_id UUID REFERENCES conversations ON DELETE CASCADE
file_name       TEXT NOT NULL
file_type       TEXT NOT NULL -- 'application/pdf', 'image/png', etc
file_size_bytes BIGINT NOT NULL
storage_path    TEXT NOT NULL -- path di Supabase Storage
extracted_text  TEXT -- text yang di-extract dari PDF (max 10000 chars)
created_at      TIMESTAMPTZ DEFAULT now()
```

### Table: `user_usage`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID UNIQUE REFERENCES auth.users ON DELETE CASCADE
messages_today  INTEGER DEFAULT 0
searches_today  INTEGER DEFAULT 0
files_total     INTEGER DEFAULT 0
conversations_total INTEGER DEFAULT 0
last_reset_date DATE DEFAULT CURRENT_DATE
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

### Batasan / Limits (Beta Tier):
| Resource | Limit | Alasan |
|---|---|---|
| Conversations per user | 20 | Mencegah abuse, cukup untuk prototyping |
| Messages per conversation | 50 | Menjaga context window tetap manageable |
| PDF uploads per conversation | 5 | Cukup untuk pitch deck + supporting docs |
| Max file size | 10 MB | Supabase free tier storage consideration |
| Tavily searches per turn | 3 | Tavily free tier = 1000/month, harus hemat |
| Max prompt length | 5000 chars | Sudah existing, tetap dipertahankan |

---

## 🔧 BACKEND INTEGRATION — DETAIL

### OpenRouter Integration

**Mengapa OpenRouter dan bukan Google AI SDK langsung?**
1. OpenRouter menyediakan unified API — bisa switch model tanpa ubah kode
2. OpenAI-compatible schema — mudah integrate library apapun
3. Mendukung streaming SSE native
4. Rate limiting dan cost tracking built-in
5. Fallback ke model lain kalau satu model down

**Model Mapping:**
| UI Name | OpenRouter Model ID | Temperature | Max Tokens |
|---|---|---|---|
| Convix Pro | `google/gemini-2.5-pro-preview` | 0.7 | 8192 |
| Convix Fast | `google/gemini-2.5-flash-preview` | 0.5 | 4096 |
| Convix Creative | `google/gemini-2.5-flash-preview` | 0.9 | 4096 |

**Streaming Flow:**
```
User sends message
    → POST /api/chat
    → Server validates auth + limits
    → Server saves user message to DB
    → Server calls OpenRouter with stream:true
    → OpenRouter streams chunks back
    → Server forwards chunks as SSE events to browser
    → If AI requests tool use:
        → Server executes Tavily search / web scrape
        → Server sends tool results to OpenRouter
        → OpenRouter continues generating with tool context
        → Streaming resumes to browser
    → On stream complete:
        → Server saves full assistant message to DB
        → Server updates conversation metadata
    → Browser renders token-by-token
```

### Tavily Integration

**Kapan Tavily dipakai:**
- AI secara otomatis memutuskan via function calling
- User bisa force trigger dengan "Web Search" toggle
- Dipakai untuk: market research, competitor analysis, trend validation

**Tavily Search Config:**
```javascript
const response = await tvly.search(query, {
  searchDepth: "advanced",    // deeper search for better results
  maxResults: 5,              // max 5 URLs per search
  includeAnswer: true,        // Tavily's AI-generated summary
  includeDomains: [],         // no restriction by default
  excludeDomains: [],
});
```

### Web Scraping (Cheerio)

**Kapan scraping dipakai:**
- Ketika AI butuh deep content dari URL spesifik yang ditemukan Tavily
- Ketika user share URL dan minta AI analyze
- AI memutuskan via function calling

**Scraping Strategy:**
```javascript
// 1. Fetch HTML
const { data } = await axios.get(url, {
  timeout: 10000,
  headers: { 'User-Agent': 'Convix Research Bot/1.0' }
});

// 2. Parse with Cheerio
const $ = cheerio.load(data);

// 3. Extract useful content
const title = $('title').text();
const metaDesc = $('meta[name="description"]').attr('content');
const mainContent = $('article, main, .content, .post').text();
const headings = $('h1, h2, h3').map((_, el) => $(el).text()).get();

// 4. Clean and truncate (max 5000 chars for LLM context)
```

### Function Calling Schema

AI akan memiliki 2 tools:

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "tavily_search",
        "description": "Search the web for real-time market data, competitors, trends, and validation signals. Use this when you need current information about a market, industry, or competitor landscape.",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The search query for market research"
            },
            "search_type": {
              "type": "string",
              "enum": ["market_research", "competitor_analysis", "trend_validation"],
              "description": "The type of search to perform"
            }
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "scrape_website",
        "description": "Extract detailed content from a specific website URL. Use this when you need to deeply analyze a competitor's product, a market report, or any specific webpage.",
        "parameters": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "The URL to scrape and analyze"
            },
            "focus": {
              "type": "string",
              "description": "What aspect to focus on when analyzing the content"
            }
          },
          "required": ["url"]
        }
      }
    }
  ]
}
```

---

## 🎨 FRONTEND CHANGES — DETAIL

### Split-Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [☰] Convix Lab                                              │
├──────┬──────────────────────────────┬───────────────────────┤
│      │                              │                       │
│  S   │    💬 CHAT PANEL (55%)       │  🔍 RESEARCH CANVAS   │
│  I   │                              │       (45%)           │
│  D   │  [User bubble]               │  ┌─────────┐         │
│  E   │                              │  │ Source 1 │──┐      │
│  B   │  [AI streaming...]           │  └─────────┘  │      │
│  A   │                              │  ┌─────────┐  │      │
│  R   │  [🔍 Searching: ...]         │  │ Source 2 │──┘      │
│      │                              │  └─────────┘         │
│ (col │  [AI continues...]           │  ┌─────────┐         │
│  lap │                              │  │ Source 3 │         │
│  sed)│                              │  └─────────┘         │
│      │                              │                       │
│      ├──────────────────────────────┤                       │
│      │ [📎][🌐][Model▾]  [📝....] [→]│                       │
└──────┴──────────────────────────────┴───────────────────────┘
```

### Research Canvas — Card Design

Setiap source card berisi:
```
┌──────────────────────────────────┐
│ 🌐 techcrunch.com               │
│ ───────────────────────────────  │
│ AI Startup Market Report 2026   │
│                                  │
│ The AI startup market is...      │
│ projected to reach $500B by...   │
│                                  │
│ [Relevance: 0.92] [Open ↗]      │
└──────────────────────────────────┘
```

Cards yang berasal dari search query yang sama dihubungkan dengan garis SVG. Ini membuat user bisa melihat "peta riset" AI secara visual.

### Sidebar Behavior (New)

1. **State awal**: Sidebar terbuka (desktop), tertutup (mobile)
2. **User mengirim pesan pertama**: Sidebar auto-collapse dengan animasi smooth
3. **Sidebar masih bisa dibuka manual** via hamburger icon
4. **History items sekarang REAL** — dari `conversations` table
5. **Grouped by date**: Hari ini, 7 hari lalu, 30 hari lalu, Lebih lama
6. **Hover pada item**: Muncul opsi rename/delete

### Streaming UX

1. Token muncul satu per satu secara real-time (bukan simulasi)
2. Saat AI sedang memanggil tool:
   - Inline card muncul: "🔍 Searching: [query]..."
   - Card berubah jadi "✅ Found 5 sources" setelah selesai
3. Saat streaming: tombol Send berubah jadi "⏹ Stop"
4. Input field disabled selama streaming
5. Auto-scroll mengikuti text baru

---

## 📁 FILE STRUCTURE (NEW FILES)

```
convix-idea-lab/
├── .env                          (MODIFIED - tambah API keys)
├── advance.md                    (NEW - file ini)
├── server.ts                     (MODIFIED - thin orchestrator)
├── server/
│   ├── routes/
│   │   ├── chat.ts               (NEW)
│   │   ├── conversations.ts      (NEW)
│   │   └── upload.ts             (NEW)
│   ├── services/
│   │   ├── openrouter.ts         (NEW)
│   │   ├── tavily.ts             (NEW)
│   │   ├── scraper.ts            (NEW)
│   │   └── supabase-admin.ts     (NEW)
│   ├── middleware/
│   │   └── auth.ts               (NEW)
│   └── prompts/
│       └── system.ts             (NEW)
├── supabase/
│   └── migration_001_core_schema.sql (NEW)
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx         (MAJOR REFACTOR)
│   ├── components/
│   │   └── chat/
│   │       ├── ChatPanel.tsx     (NEW)
│   │       ├── MessageBubble.tsx (NEW)
│   │       ├── ChatInput.tsx     (NEW)
│   │       ├── ResearchCanvas.tsx(NEW)
│   │       ├── SourceCard.tsx    (NEW)
│   │       └── ToolCallCard.tsx  (NEW)
│   ├── hooks/
│   │   ├── useChat.ts            (NEW)
│   │   └── useConversations.ts   (NEW)
│   └── services/
│       └── api.ts                (NEW)
```

---

## 🚀 EXECUTION PHASES

### Phase 1: Database (Hari 1)
- [ ] Buat SQL migration file
- [ ] Execute di Supabase SQL Editor
- [ ] Verify tabel, RLS, triggers, indexes
- [ ] Test insert/query via Supabase dashboard

### Phase 2: Backend Services (Hari 1-2)
- [ ] Setup OpenRouter client service
- [ ] Setup Tavily search service
- [ ] Setup Cheerio scraper service
- [ ] Setup Supabase admin client
- [ ] Buat auth middleware
- [ ] Buat system prompt dengan tool definitions
- [ ] Buat streaming chat endpoint (SSE)
- [ ] Buat conversation CRUD endpoints
- [ ] Buat file upload endpoint
- [ ] Refactor server.ts jadi modular
- [ ] Test semua endpoints via curl/Postman

### Phase 3: Frontend Core (Hari 2-3)
- [ ] Buat API service layer
- [ ] Buat useChat hook dengan SSE streaming
- [ ] Buat useConversations hook
- [ ] Buat ChatPanel component
- [ ] Buat MessageBubble component (with markdown)
- [ ] Buat ChatInput component (model selector, attachment, web search)
- [ ] Buat ResearchCanvas component
- [ ] Buat SourceCard component
- [ ] Buat ToolCallCard component

### Phase 4: Dashboard Integration (Hari 3)
- [ ] Refactor Dashboard.tsx sebagai layout orchestrator
- [ ] Implement split-screen layout
- [ ] Connect sidebar ke real conversations
- [ ] Implement sidebar auto-collapse
- [ ] Wire up semua components

### Phase 5: Polish (Hari 3-4)
- [ ] Streaming UX (stop button, typing indicator)
- [ ] Research canvas connection lines
- [ ] Empty states dan loading states
- [ ] Error handling (network errors, rate limits, etc)
- [ ] Responsive design (mobile: canvas jadi tab/drawer)
- [ ] Performance optimization
- [ ] Final visual polish

---

## 🔮 RENCANA KE DEPAN (FUTURE ROADMAP)

Setelah implementasi di atas selesai, berikut fitur-fitur yang bisa ditambahkan:

### Near-term (Minggu depan)
1. **Markdown rendering** di chat — headers, lists, bold, code blocks, tables
2. **Conversation search** — cari di semua conversation history
3. **Export results** — download analisis sebagai PDF/markdown
4. **Voice input** — Web Speech API untuk speech-to-text input
5. **Dark mode** di Dashboard (sudah ada theme system di landing page)

### Mid-term (Bulan depan)
1. **Questionnaire data integration** — jawaban questionnaire masuk ke system prompt AI
2. **Multi-turn tool calling** — AI bisa melakukan beberapa pencarian berturut-turut
3. **Source verification** — AI cross-reference multiple sources
4. **Competitive matrix generation** — AI bikin tabel perbandingan kompetitor
5. **SWOT auto-generation** — AI bikin SWOT analysis visual
6. **Branding suggestions** — AI suggest nama, tagline, positioning

### Long-term (Kuartal depan)
1. **Team collaboration** — multiple users dalam satu workspace
2. **API access** — users bisa akses Convix API programmatically
3. **Webhook notifications** — notifikasi saat analisis selesai
4. **Advanced analytics** — dashboard usage analytics
5. **Custom AI models** — fine-tuned model untuk domain spesifik
6. **Integration marketplace** — connect dengan tools lain (Notion, Slack, etc)

---

## ⚙️ KEPUTUSAN TEKNIS YANG SUDAH DIAMBIL

| Keputusan | Pilihan | Alasan |
|---|---|---|
| AI Gateway | OpenRouter | Unified API, model switching, cost tracking |
| Primary Model | Gemini 2.5 Flash Preview | Cepat, murah, capable |
| Search Tool | Tavily | Best-in-class AI search, structured results |
| Scraping | Cheerio + Axios | Sudah installed, lightweight, server-side |
| Database | Supabase PostgreSQL | Sudah setup, RLS built-in, realtime capable |
| File Storage | Supabase Storage | Terintegrasi dengan DB, RLS support |
| Streaming | SSE (Server-Sent Events) | Simple, unidirectional, browser native |
| State Management | Custom hooks | Lightweight, no Redux needed |
| Canvas Library | Pure React + SVG | Lighter than ReactFlow for this use case |
| Markdown Rendering | Custom parser | Avoid heavy dependency, control formatting |

---

## 📌 NOTES

- **Tidak ada perubahan pada landing page** — semua perubahan terjadi di Dashboard `/app` dan backend
- **Existing routing structure dipertahankan** — sesuai dengan aturan prompt.md
- **Design language tetap konsisten** — Convix orange (#ef4d23), warm cream, glassmorphism
- **Semua tools dan library yang dipakai sudah terinstall** di project — tidak perlu `npm install` tambahan besar
- **Package tambahan yang mungkin dibutuhkan**: Tidak ada yang major, mungkin hanya helper kecil
