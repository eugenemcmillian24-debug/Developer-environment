# DevBase v2.0 — AI-Powered Dev Environment

> Transform your Android phone into a complete AI-powered development environment.

## Features

- **6-Phase Setup Guide** — Step-by-step mobile dev environment setup (Termux → VS Code → React/Next.js → Expo → Backend → Git)
- **Multi-Provider AI Chat** — OpenRouter (40+ models) + Groq (ultra-fast) with streaming responses
- **Voice-to-App** — Speak your app idea → Groq Whisper transcription → AI code generation
- **Project Scaffolding** — Instant Next.js, React, Expo, and Node.js project templates with AI customization
- **Multi-Agent System** — Architect, Frontend, Backend, and Review agents for intelligent code generation
- **Progress Tracking** — Visual progress bar with localStorage persistence
- **Copy-to-Clipboard** — One-click copying for all code blocks

## Quick Start

```bash
cd devbase
npm install
cp .env.local.example .env.local
# Add your API keys to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Edit `.env.local`:

```env
# Get from https://openrouter.ai/keys (free tier available)
OPENROUTER_API_KEY=your_openrouter_key

# Get from https://console.groq.com/keys (free tier available)
GROQ_API_KEY=your_groq_key
```

Both providers are optional — the app works with either one, or both for full functionality.

| Feature | OpenRouter | Groq |
|---------|-----------|------|
| Chat | ✅ 40+ models | ✅ Fast LLMs |
| Code Generation | ✅ | ✅ |
| Voice Transcription | ❌ | ✅ Required |
| Free Models | ✅ Many | ✅ All |

## AI Models Included

**OpenRouter (Free):**
- Llama 3.3 70B, DeepSeek R1, Gemma 3 27B, Devstral, Mistral Small, Qwen3 Coder, Qwen3 235B, Nemotron Ultra, Kimi VL

**Groq:**
- Llama 3.3 70B Versatile (default), Llama 3.1 8B Instant, DeepSeek R1 Distill, Gemma 2 9B, Mixtral 8x7B

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand with localStorage persistence
- **AI:** OpenRouter API + Groq API (server-side proxy)
- **Voice:** MediaRecorder API + Groq Whisper

## Running on Termux (Android)

```bash
pkg install nodejs-lts
git clone <repo-url>
cd devbase
npm install
cp .env.local.example .env.local
micro .env.local  # Add your API keys
npm run dev
# Open http://localhost:3000 in your browser
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Streaming chat with any provider/model |
| `/api/transcribe` | POST | Voice transcription via Groq Whisper |
| `/api/generate` | POST | AI code generation |
| `/api/scaffold` | POST | Project scaffolding with optional AI |
| `/api/models` | GET | List available models and providers |

## License

MIT — see [LICENSE](../LICENSE)
