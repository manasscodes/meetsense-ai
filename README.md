
<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/LiveKit-Cloud-red?style=for-the-badge&logo=livekit" alt="LiveKit">
  <img src="https://img.shields.io/badge/Google-Gemini-8E75B2?style=for-the-badge&logo=google" alt="Gemini">
</div>

<h1 align="center">
  <a href="https://github.com/manasscodes/meetsense-ai">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=40&duration=4000&pause=1000&color=B8FF3B&center=true&vCenter=true&random=false&width=500&height=70&lines=MeetSense" alt="MeetSense Title" />
  </a>
</h1>

<p align="center">
  <b>A Futuristic AI-Powered Video Meeting & Mock Interview Platform</b>
  <br />
  <i>Built with Next.js 16, LiveKit, Gemini AI, and Neon DB.</i>
  <br />
  <br />
  <a href="#-features"><strong>Explore Features »</strong></a>
  <br />
  <br />
  <a href="https://github.com/manasscodes/meetsense-ai/issues">Report Bug</a>
  ·
  <a href="https://github.com/manasscodes/meetsense-ai/issues">Request Feature</a>
</p>

<br />

---

## 🎯 About The Project

**MeetSense** is a production-ready, full-stack SaaS application designed to revolutionize online interviews and meetings. It combines real-time HD video conferencing with advanced AI capabilities like live transcription, multilingual support, and instant performance evaluation.

Built as a **Final Year Project**, it demonstrates modern web architecture, real-time data handling, and AI integration using the latest technologies available in 2026.

### 🎬 Demo
> *Coming Soon: Live Deployment Link*

---

## ✨ Key Features

### 📹 Core Meeting Engine
*   **HD Video Conferencing**: Powered by LiveKit Cloud for sub-second latency.
*   **Real-time Chat**: In-meeting messaging for participants.
*   **Screen Sharing**: One-click screen sharing for collaborative sessions.
*   **Adaptive Layout**: Grid view that focuses on the active speaker.

### 🧠 AI Intelligence Layer
*   **Live Transcription**: Real-time Speech-to-Text using Groq Whisper (Mic-triggered).
*   **Instant Summaries**: Auto-generated meeting summaries and action items via Gemini Flash.
*   **Interview Assistant**: AI suggests technical questions in real-time for interviewers.
*   **Performance Reports**: Candidates receive a detailed scorecard (Technical, Communication, Confidence) after interviews.

### 🗓️ Scheduling & Management
*   **Hybrid Modes**: Switch seamlessly between "Normal Meeting" and "Mock Interview" modes.
*   **Smart Calendar**: Schedule interviews and view upcoming sessions.
*   **Meeting History**: Persistent storage of transcripts, summaries, and recordings.

### 🎨 Design & UX
*   **Neon-Minimal UI**: A premium, futuristic design language with soft shadows and glowing accents.
*   **Responsive**: Fully functional on Desktop and Mobile.
*   **Secure Auth**: Google & Email sign-in via Clerk.

---

## 🛠️ Tech Stack (2026 Ready)

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/UI, Radix UI |
| **Backend** | Next.js Server Actions, Drizzle ORM |
| **Database** | Neon Postgres (Serverless) |
| **Video** | LiveKit Cloud (WebRTC) |
| **Auth** | Clerk (Google OAuth, Email) |
| **AI / ML** | Google Gemini 3.1 Flash, Groq Whisper |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   Node.js 20+
*   pnpm (recommended) or npm
*   A Neon Database account
*   A LiveKit Cloud account
*   Google AI Studio API Key
*   Groq API Key
*   Clerk Account

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/manasscodes/meetsense-ai.git
    cd meetsense-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root directory and add your keys:

    ```env
    # Database (Neon)
    DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/meetsense?sslmode=require"

    # Auth (Clerk)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."

    # LiveKit
    LIVEKIT_API_KEY="API..."
    LIVEKIT_API_SECRET="secret..."
    NEXT_PUBLIC_LIVEKIT_URL="wss://your-room.livekit.cloud"

    # AI Services
    GOOGLE_GEMINI_API_KEY="AIza..."
    GROQ_API_KEY="gsk_..."
    ```

4.  **Push Database Schema**
    ```bash
    npm run db:push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```bash
meetsense-ai/
├── src/
│   ├── actions/       # Server Actions (DB & Logic)
│   ├── app/           # Next.js App Router Pages
│   ├── components/    # Reusable UI Components
│   ├── hooks/         # Custom React Hooks
│   ├── lib/           # Utils, DB Schema, Auth Config
│   └── types/         # TypeScript Definitions
├── public/
├── .env
└── README.md
```

---

## 🗺️ Roadmap

- [x] Next.js 16 Setup & Design System
- [x] Clerk Authentication (Google & Email)
- [x] LiveKit Video Integration
- [x] Real-time Transcription (Groq)
- [x] AI Summarization & Feedback (Gemini)
- [x] Mock Interview Mode
- [x] Calendar & Scheduling
- [ ] Mobile App (React Native)
- [ ] Multi-language Support (Hindi, Marathi)

---

## 👤 Author

**Manas Kolaskar**

*   **GitHub**: [@manasscodes](https://github.com/manasscodes)
*   **Project Link**: [https://github.com/manasscodes/meetsense-ai](https://github.com/manasscodes/meetsense-ai)

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

<p align="center">
  Made with 💚 and ☕ for Final Year Project 2026
</p>


---

**Copy this and paste it into your `README.md` file.** Then commit it:

```bash
git add README.md
git commit -m "docs: create professional README"
git push
```