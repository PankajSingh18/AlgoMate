<div align="center">

<!-- Animated Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:6366f1&height=210&section=header&text=AlgoMate&fontSize=68&fontColor=ffffff&fontAlignY=34&desc=Visualize.%20Understand..%20Master...&descAlignY=66&descSize=20&animation=fadeIn" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-algomate.me-6366f1?style=for-the-badge&logoColor=white)](https://algomate.me)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![CI](https://github.com/pankajsingh18/AlgoMate/actions/workflows/test.yml/badge.svg)](https://github.com/pankajsingh18/AlgoMate/actions/workflows/test.yml)
[![Security Policy](https://img.shields.io/badge/Security-Policy-red?style=for-the-badge&logo=shieldsdotio&logoColor=white)](SECURITY.md)
[![Stars](https://img.shields.io/github/stars/pankajsingh18/AlgoMate?style=for-the-badge&color=f59e0b)](https://github.com/pankajsingh18/AlgoMate/stargazers)
[![Forks](https://img.shields.io/github/forks/pankajsingh18/AlgoMate?style=for-the-badge&color=6366f1)](https://github.com/pankajsingh18/AlgoMate/forks)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ec4899?style=for-the-badge)](CONTRIBUTING.md)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/Gv2N4U3KAc)

<br/>

> **An open-source, interactive DSA learning platform that brings algorithms to life through step-by-step animations, structured learning paths, and progress tracking.**
>
> Built for students, developers, and interview candidates who want to **see** how algorithms work — not just read about them.

[**Features**](#features) · [**Screenshots**](#screenshots) · [**Tech Stack**](#tech-stack) · [**Quick Start**](#quick-start) · [**Project Structure**](#project-structure) · [**Contributing**](#contributing) · [**License**](#license)

<br/>

</div>

## Table of Contents

- [Why AlgoMate?](#why-algobuddy)
- [Features](#features)
  - [Algorithm Visualizer](#algorithm-visualizer)
  - [User System & Progress Tracking](#user-system--progress-tracking)
  - [Blog Platform](#blog-platform)
  - [UX & Design](#ux--design)
- [Supported Algorithms & Data Structures](#supported-algorithms--data-structures)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Database Schema](#3-configure-database-schema)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Start the Development Server](#5-start-the-development-server)
  - [6. Other Commands](#6-other-commands)
- [Project Structure](#project-structure)
- [Project Roadmap](#project-roadmap)
- [Contributing](#contributing)
- [Community](#community)
- [Star History](#star-history)
- [Contributors](#contributors)
- [License](#license)

<br/>

## Why AlgoMate?

> *"Tell me and I forget, teach me and I remember, involve me and I learn."* — Benjamin Franklin

Most DSA resources are walls of text and static diagrams. **AlgoMate changes that** by letting you interact with every data structure and algorithm in real time.

Tools like [VisuAlgo](https://visualgo.net/) show animations but are read-only. AlgoMate goes further: algorithms are coupled with **user progress tracking, streaks, AI-assisted explanations, and a practice sheet** — so it functions as a learning system, not just a reference. It's also fully open-source, so every visualizer is a contribution opportunity.

<table>
<td width="52%">

**The Problem**
- Static textbooks don't show algorithm flow
- Copying code doesn't build understanding
- No feedback loop on what you've mastered
- Hard to stay motivated without visible progress

</td>
<td width="47%">

**The AlgoMate Way**
- **Watch** algorithms execute step-by-step
- **Interact** with data structures directly
- **Track** your learning journey with streaks
- **Read** companion blogs for deeper theory

</td>
</table>

<br/>

## Features

### Algorithm Visualizer

Animated, step-by-step visualizations for a wide range of DSA topics:

<details>
<summary><strong>Sorting, Searching, Stack, Queue, Linked List</strong></summary>

<table>
<tr>
<td align="center" width="20%">

**Sorting**
</td>
<td align="center" width="20%">

**Searching**
</td>
<td align="center" width="20%">

**Stack**
</td>
<td align="center" width="20%">

**Queue**
</td>
<td align="center" width="20%">

**Linked List**
</td>
</tr>
<tr>
<td>

- Bubble Sort
- Insertion Sort
- Selection Sort
- Merge Sort
- Quick Sort
- Shell Sort
- Radix Sort
- Counting Sort

</td>
<td>

- Linear Search
- Binary Search
- Comparison Mode
- Sliding Window

</td>
<td>

- Push / Pop
- Peek / isEmpty
- Polish Notation
- Array & LL impl.

</td>
<td>

- Enqueue / Dequeue
- Circular Queue
- Priority Queue
- Double-ended
- Array & LL impl.

</td>
<td>

- Singly Linked
- Doubly Linked
- Circular
- Insert / Delete
- Reverse / Merge

</td>
</tr>
</table>

</details>

<details>
<summary><strong>Trees, HashMap, Graph, String, Complexity</strong></summary>

<table>
<tr>
<td align="center" width="20%">

**Trees**
</td>
<td align="center" width="20%">

**HashMap**
</td>
<td align="center" width="20%">

**Graph**
</td>
<td align="center" width="20%">

**String**
</td>
<td align="center" width="20%">

**Complexity**
</td>
</tr>
<tr>
<td>

- Binary Tree types
- In-order Traversal
- BST operations
- Heaps & Tries

</td>
<td>

- Insert / Search / Delete
- Collision handling
- Visual hash buckets

</td>
<td>

- BFS / DFS
- Dijkstra / A*
- Bellman-Ford
- Floyd-Warshall
- Kruskal / Prim
- Tarjan / Kosaraju
- Ford-Fulkerson
- Topological Sort

</td>
<td>

- KMP Algorithm
- Z-Algorithm

</td>
<td>

- Time & Space analysis
- Side-by-side comparisons
- Powered by Recharts

</td>
</tr>
</table>

</details>

<br/>

### User System & Progress Tracking

| Feature | Description |
|---|---|
| **Auth** | Email/password with Cloudflare Turnstile captcha + Google OAuth |
| **Dashboard** | Module-level progress tracking per data structure |
| **Streaks** | Activity heatmap (last 90 days) + daily streak counter |
| **AI Assistant** | Built-in chatbot powered by Gemini for concept help |
| **Bookmarks** | Save and revisit problems with the bookmark system |

<br/>

### Blog Platform

| Feature | Description |
|---|---|
| **Categories** | Filter articles by DSA topic |
| **Full-text Search** | Instantly find relevant articles |
| **Reading Time** | Estimated reading time on every article |
| **Rich Content** | In-depth articles on core DSA concepts |

<br/>

### UX & Design

| Feature | Description |
|---|---|
| **Dark/Light Mode** | Theme toggle persisted to `localStorage` |
| **Responsive** | Optimized for mobile, tablet, and desktop |
| **Animations** | Smooth visualizations via GSAP + Framer Motion |
| **Particle Effects** | Interactive background using tsParticles |

<br/>

## Supported Algorithms & Data Structures

| Category | Coverage | Visualization |
|----------|----------|:-------------:|
| Sorting | Bubble, Selection, Insertion, Merge, Quick, Shell, Radix, Counting | ✓ |
| Searching | Linear, Binary, Sliding Window | ✓ |
| Stack | Push, Pop, Peek, Array & Linked List | ✓ |
| Queue | Simple, Circular, Priority, Deque | ✓ |
| Linked List | Singly, Doubly, Circular | ✓ |
| Trees | Binary Tree, BST, Heap, Trie | ✓ |
| HashMap | Insert, Search, Delete, Collision Handling | ✓ |
| Graph | BFS, DFS, Dijkstra, A*, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Tarjan, Kosaraju, Ford-Fulkerson, Topological Sort | ✓ |
| String | KMP Algorithm, Z-Algorithm | ✓ |
| Complexity Analysis | Time & Space Complexity Graphs | ✓ |


## Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white) | App Router, SSR, API routes |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) | Utility-first CSS framework |
| **Database** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) | PostgreSQL + Auth + Realtime |
| **Animation** | ![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=white) ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white) | Visualizer animations |
| **Charts** | ![Recharts](https://img.shields.io/badge/Recharts-FF6384?logo=chartdotjs&logoColor=white) | Complexity comparison graphs |
| **Editor** | ![Monaco](https://img.shields.io/badge/Monaco_Editor-007ACC?logo=visualstudiocode&logoColor=white) | In-browser code editor |
| **Email** | ![Nodemailer](https://img.shields.io/badge/Nodemailer-339933?logo=gmail&logoColor=white) | Transactional emails via Gmail |
| **Captcha** | ![Cloudflare](https://img.shields.io/badge/Turnstile-F38020?logo=cloudflare&logoColor=white) | Bot protection on auth |
| **Analytics** | ![GA4](https://img.shields.io/badge/Google_Analytics_4-E37400?logo=googleanalytics&logoColor=white) | Usage tracking |
| **Rate Limiting** | ![Upstash](https://img.shields.io/badge/Upstash_Redis-DC382D?logo=redis&logoColor=white) | API rate limiting |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white) | Serverless hosting |
| **CI/CD** | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white) | Multi-OS testing pipeline |

</div>

<br/>

## Architecture

For a comprehensive guide on component boundaries, database triggers, data flows, and codebase principles, see the [System Architecture Guide](./Architecture.md).

```mermaid
graph TB
    subgraph Client["Client — Next.js 16 App Router"]
        UI["UI Components<br/>(React + Tailwind)"]
        VIS["Visualizer Engine<br/>(GSAP + Framer Motion)"]
        CHARTS["Complexity Graphs<br/>(Recharts)"]
        EDITOR["Code Editor<br/>(Monaco)"]
        THEME["Theme System<br/>(Dark/Light)"]
    end
    subgraph API["API Layer"]
        AUTH_API["Auth Routes"]
        CONTACT["Contact API"]
        REVIEW["Review API"]
        CHATBOT["AI Assistant<br/>(Gemini API)"]
    end
    subgraph Services["External Services"]
        SUPA["Supabase<br/>(DB + Auth)"]
        CF["Cloudflare<br/>Turnstile"]
        GA["Google<br/>Analytics"]
        REDIS["Upstash<br/>Redis"]
        MAIL["Gmail<br/>(Nodemailer)"]
        GEMINI["Google<br/>Gemini API"]
    end
    UI --> VIS
    UI --> CHARTS
    UI --> EDITOR
    UI --> THEME
    UI --> API
    UI --> SUPA
    AUTH_API --> SUPA
    AUTH_API --> CF
    CONTACT --> MAIL
    CONTACT --> CF
    REVIEW --> MAIL
    REVIEW --> CF
    CHATBOT --> REDIS
    CHATBOT --> GEMINI
    UI --> GA
    style Client fill:#1e1b4b,stroke:#818cf8,stroke-width:3px,color:#e0e7ff
    style API fill:#1e3a5f,stroke:#38bdf8,stroke-width:3px,color:#e0f2fe
    style Services fill:#064e3b,stroke:#34d399,stroke-width:3px,color:#d1fae5
```

<br/>

## Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| **Node.js** | `>= 20.x` |
| **npm** | `>= 10.x` |
| **Git** | Latest |

### 1. Clone the Repository

```bash
git clone https://github.com/pankajsingh18/AlgoMate.git
cd AlgoMate
```

### 2. Install Dependencies

```bash
npm install
```

> **Note:** This project uses `isolated-vm` for secure code execution. If you encounter build errors, ensure you have Python and a C++ compiler installed (required for native addon compilation).

### 3. Configure Database Schema

The full schema is maintained in **[`supabase_setup.sql`](./supabase_setup.sql)** at the project root — run it in the Supabase SQL Editor. It covers RLS policies for all tables, admin policies for `community_contributors`, and two stored functions for atomic streak updates.

> **Note:** Without running the full schema, progress tracking, bookmarks, avatars, and streak features will not work locally.

<details>
<summary><strong>View table overview and example RLS policy</strong></summary>

| Table | Purpose |
|---|---|
| `user_progress` | Tracks per-problem completion status |
| `user_activity` | Powers the 90-day activity heatmap |
| `user_profiles` | Avatar URL and community join status |
| `problem_bookmarks` | User-saved problem bookmarks |
| `user_practice_stats` | Streak counters (current + longest) |
| `community_contributors` | Public contributor registry |
| `topic_comments` | Per-visualizer discussion threads |
| `pending_messages` | SMTP fallback queue for contact/review emails |
| `newsletter_subscriptions` | Footer newsletter opt-ins |

Representative RLS setup for `user_progress`:

```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

The schema also defines `increment_streak_on_completion()` and `upsert_progress_and_update_streak()` — two PL/pgSQL functions that update streaks atomically to avoid TOCTOU race conditions. See [`supabase_setup.sql`](./supabase_setup.sql) for the full definitions.

</details>

### 4. Configure Environment Variables

Create a `.env.local` file in the project root. See [`.env.example`](.env.example) for the full reference.

<details>
<summary><strong>View all environment variables</strong></summary>

```env
# ──────────── Email ────────────
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-google-app-password
REVIEW_INBOX_EMAIL=optional-inbox@gmail.com

# ──────────── Supabase ────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# ──────────── Cloudflare Turnstile ────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# ──────────── Google Analytics ────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ──────────── AI Chatbot ────────────
GEMINI_API_KEY=your-gemini-api-key

# ──────────── Rate Limiting (Production) ────────────
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# ──────────── Spring Boot Backend CORS (Optional in dev, required in prod) ────────────
ALLOWED_ORIGINS=http://localhost:3000
APP_ENV=dev
```

</details>

### 5. Start the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start visualizing!

### 6. Other Commands

```bash
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run test           # Run lint + security tests
npm run test:security  # Run XSS security tests only
```

<br/>

## Project Structure

<details>
<summary><strong>View full directory tree</strong></summary>

```
AlgoMate/
│
├── src/app/                         # Next.js App Router
│   ├── api/                         #   API routes (auth, chatbot, mysheet, etc.)
│   ├── arena/                       #   Tournament / arena page
│   ├── dashboard/                   #   User dashboard
│   ├── login/                       #   Auth pages
│   ├── visualizer/                  #   Algorithm visualizer pages
│   │   ├── array/                   #     Sorting & array algorithms
│   │   ├── graph/                   #     Graph algorithm visualizers
│   │   ├── string/                  #     String algorithm visualizers (KMP, Z-Algo)
│   │   └── ...                      #     Other DSA visualizers
│   │
│   ├── components/                  #   Shared UI components
│   │   ├── dashboard/               #     Heatmap, streaks
│   │   ├── models/                  #     Data structure models
│   │   └── ui/                      #     Reusable UI primitives
│   │
│   ├── hooks/                       #   Custom React hooks
│   ├── layout.jsx                   #   Root layout
│   └── page.jsx                     #   Landing page
│
├── src/features/algorithms/         # Algorithm logic (pure functions)
│   ├── graph/                       #   Graph algorithm implementations
│   └── string/                      #   String algorithm implementations
│
├── src/lib/                         # Utility libraries
│   ├── supabase.js                  #   Supabase client config
│   ├── auth.js                      #   Auth helpers
│   ├── activity.js                  #   Activity tracking logic
│   └── gtag.js                      #   Google Analytics helper
│
├── backend/                         # Spring Boot API (optional, for practice features)
├── arena-socket-server/             # WebSocket server for tournament arena
├── public/                          # Static assets & screenshots
├── docs/                            # Documentation
├── security-tests/                  # Security test suite
├── .github/                         # GitHub Actions workflows
│
├── supabase_setup.sql               # Database schema & RLS policies
├── middleware.js                    # Next.js middleware (auth, rate limiting)
├── next.config.mjs                  # Next.js configuration
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Dependencies & scripts
```

</details>

<br/>

## Project Roadmap

| Status | Item |
|:------:|------|
| Done | Interactive algorithm visualizations |
| Done | User authentication and progress tracking |
| Done | AI-powered learning assistant |
| Done | Graph algorithm visualizers |
| Done | String algorithm visualizers (KMP, Z-Algorithm) |
| In Progress | Expand the collection of algorithm and data structure visualizations |
| In Progress | Improve accessibility and mobile experience |
| In Progress | Enhance learning resources and documentation |
| Planned | Introduce additional educational content and practice modules |
| Planned | Continue community-driven improvements and feature enhancements |

## Contributing

We welcome contributions! AlgoMate is built by the community, for the community.

### Contribution Areas

| Area | What you can do |
|---|---|
| **Bug Fixes** | Squash bugs and resolve issues |
| **UI/UX** | Improve responsiveness, accessibility, design |
| **New Visualizers** | Add new DSA visualizers & animations |
| **Documentation** | Improve guides, README, contributor docs |
| **Performance** | Optimize app performance & efficiency |
| **Themes** | Enhance dark/light mode experience |

### Getting Started

<details>
<summary><strong>Step-by-step: fork, branch, commit, PR</strong></summary>

```bash
# 1. Fork this repo and clone your fork
git clone https://github.com/YOUR_USERNAME/AlgoMate.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: describe your change"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

</details>

> For detailed guidelines, please read our [**Contributing Guide**](CONTRIBUTING.md) and [**Code of Conduct**](CODE_OF_CONDUCT.md).

### Issue Assignment Process

1. Browse [**open issues**](https://github.com/pankajsingh18/AlgoMate/issues) or create a new one
2. Comment asking to be assigned
3. Wait for maintainer assignment before starting
4. Submit a PR referencing the issue number

<br/>

## Community

<div align="center">

[![Discord](https://img.shields.io/badge/Join_our_Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/Gv2N4U3KAc)

Ask questions, share ideas, show off your contributions, and connect with fellow learners!

</div>

<br/>

## Star History

<div align="center">

If AlgoMate helped you learn, please consider giving it a star — it means a lot!

[![Stars over time](https://img.shields.io/github/stars/pankajsingh18/AlgoMate?style=for-the-badge&logo=github&color=f59e0b)](https://star-history.com/#pankajsingh18/AlgoMate)

</div>

<br/>

## Contributors

<div align="center">

<a href="https://github.com/pankajsingh18/AlgoMate/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pankajsingh18/AlgoMate&max=100&columns=12" />
</a>

</div>

<br/>

## License

<div align="center">

This project is licensed under the **MIT License** — see the [**LICENSE**](LICENSE) file for details.

</div>

<br/>

---

<div align="center">

**Built with ♥ by the AlgoMate community**

[Website](https://www.algomate.me/) · [Discord](https://discord.gg/Gv2N4U3KAc) · [Issues](https://github.com/pankajsingh18/AlgoMate/issues) · [Pull Requests](https://github.com/pankajsingh18/AlgoMate/pulls)

</div>
