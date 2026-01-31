✈️ R-ATC — Real-Time AI Air Traffic Controller for Flight Sim Gamers

R-ATC is a browser-based AI companion that simulates a realistic Air Traffic Controller for flight simulator games like Roblox PTFS and similar environments.

Players share their screen while flying, and R-ATC analyzes the live visual context of the game to understand aircraft state, movement, and flight phase—then responds like a real ATC with immersive, radio-style communication.

No installs. No plugins. Just fly and talk.

🧠 What R-ATC Does

🖥️ Live screen understanding
Analyzes shared screen data to infer aircraft position, heading, and flight phase.

🎙️ AI-powered ATC companion
Responds with realistic ATC phraseology and procedural logic.

🧭 Context-aware instructions
Takeoff, approach, landing, taxi, and situational guidance.

🌐 Runs entirely in the browser
Powered by modern web APIs and AI inference.

🎮 Built for sim communities
Designed with Roblox PTFS and casual-to-serious simmers in mind.

🧱 Tech Stack
Frontend Framework

React 19.2.4 — UI library with React DOM

TypeScript 5.8.2 — Fully type-safe codebase

Build Tooling

Vite 6.2.0 — Lightning-fast dev server and build tool

@vitejs/plugin-react — React + Fast Refresh support

AI / ML Services

OpenAI SDK 4.82.0

Multi-provider AI client

Supports OpenAI, Google Gemini, DeepSeek, GitHub Models, Chutes AI

Azure AI Inference — Azure-hosted AI capabilities

Backend / Database

Supabase 2.93.3

Authentication

Database

Real-time subscriptions

Browser APIs

MediaDevices API — Screen capture for simulator analysis

Web Speech API — Native voice recognition & text-to-speech

Utilities

uuid — Unique identifier generation

dotenv — Environment variable management

Development Setup

ES2022 target

Path aliasing: @/ → ./src/

Dev server: http://localhost:3000

🧠 How It Works (High-Level)

User shares their simulator screen

Visual data is captured via browser APIs

Flight context is inferred (movement, alignment, phase)

AI reasons over the current state

R-ATC responds like a real controller

🎯 Use Cases

🧑‍✈️ Solo pilots wanting immersion

🎮 Roblox PTFS players practicing procedures

🎥 Streamers adding live ATC interaction

📚 Beginners learning aviation basics

✈️ Casual simmers who want realism without complexity

🛣️ Roadmap

 Voice-to-voice ATC radio communication

 Airport & runway detection

 Multi-aircraft traffic awareness

 Custom ATC personalities

 Support for additional simulators

🧑‍✈️ Vision

R-ATC is not just an assistant—it’s a flight companion.
The goal is to make solo flying feel alive, procedural, and cinematic.

📄 License

MIT
