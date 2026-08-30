# Contributing to AlgoBuddy

Thank you for your interest in contributing to **AlgoBuddy**!
We welcome and appreciate contributions from the community to help make this project better.

---

**Join our community** — **Discord Server: <https://discord.gg/Gv2N4U3KAc>**

---

## ↪️Table of Contents

- [Contribution Areas](#️-contribution-areas)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#️-getting-started)
- [Development Workflow](#️-development-workflow)
- [Issue Assignment Process](#️-issue-assignment-process)
- [Pull Request Guidelines](#️-pull-request-guidelines)
- [Reporting Issues](#️-reporting-issues)
- [Need Help?](#️-need-help)

---

# ↪️ Contribution Areas

We accept contributions in the following areas:

| Area                   | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Bug Fixes**          | Resolve existing bugs and issues                  |
| **UI/UX Improvements** | Enhance responsiveness, accessibility, and design |
| **New Visualizers**    | Add new DSA visualizers and animations            |
| **Documentation**      | Improve guides, README, and contributor docs      |
| **Performance**        | Optimize application performance and efficiency   |
| **Theme Enhancements** | Improve dark/light mode experience                |

Feel free to suggest new contribution ideas by opening an issue first.

---

# ↪️ Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router)                            |
| Library   | React.js                                           |
| Styling   | Tailwind CSS                                       |
| Language  | JavaScript                                         |
| Database / Auth | Supabase                                     |
| Animation | GSAP, Framer Motion                                |
| Charts    | Recharts                                           |
| Email     | Nodemailer (Gmail)                                 |
| Captcha   | Cloudflare Turnstile                               |

---

# ↪️ Getting Started

Follow these steps to set up the project locally.

## 1. Fork the Repository

Click the **Fork** button at the top-right corner of this repository.

## 2. Clone Your Fork

```bash
git clone https://github.com/your-username/AlgoBuddy.git
```

## 3. Navigate to the Project Directory

```bash
cd AlgoBuddy
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Set Up Environment Variables

Copy the example env file and fill in the required values:

```bash
cp .env.example .env.local
```

| Variable                           | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| `EMAIL_USER`                       | Gmail address used to send contact/review emails |
| `EMAIL_PASSWORD`                   | Gmail App Password (not your account password)   |
| `NEXT_PUBLIC_GA_ID`                | Google Analytics Measurement ID                  |
| `NEXT_PUBLIC_SUPABASE_URL`         | Your Supabase project URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | Supabase anonymous/public key                    |
| `SUPABASE_SERVICE_KEY`             | Supabase service role key (server-side only)     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`   | Cloudflare Turnstile site key                    |
| `TURNSTILE_SECRET_KEY`             | Cloudflare Turnstile secret key                  |
| `TURNSTILE_BYPASS`                 | Bypass Turnstile locally (set to `true` to bypass) |
| `UPSTASH_REDIS_REST_URL`           | Upstash Redis REST URL for rate limiting         |
| `UPSTASH_REDIS_REST_TOKEN`         | Upstash Redis REST Token for rate limiting       |
| `GEMINI_API_KEY`                   | Google Gemini API key for AI chatbot             |
| `AUTO_CONFIRM_EMAIL`               | Auto confirm user email in Supabase (if set)     |
| `NEXT_PUBLIC_SHOW_COMMUNITY_BADGE`  | Toggle visibility of community badge in UI       |
| `NEXT_PUBLIC_USE_SPRING_BOOT_API`  | Route requests to Java Spring Boot API locally   |
| `NEXT_PUBLIC_SPRING_BOOT_API_URL`  | URL of local Java Spring Boot API (default `http://localhost:8080`) |

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

## 6. Start the Development Server

```bash
npm run dev
```

The application will start locally at `http://localhost:3000`.

---

# ↪️ Development Workflow

Follow the workflow below while contributing to the project.

## 1. Create a New Branch

Create a separate branch before making any changes.

**Syntax**

```bash
git checkout -b feature/your-feature-name
```

**Example**

```bash
git checkout -b fix/navbar-responsive-issue
```

---

## 2. Make Your Changes

You can now start working on:

- Bug fixes
- UI/UX improvements
- Documentation updates
- Performance enhancements
- New visualizers

---

## 3. Commit Your Changes

Write clear and meaningful commit messages.

**Syntax**

```bash
git commit -m "type: short-description"
```

**Example**

```bash
git commit -m "fix: improve navbar responsiveness"
```

**Recommended Commit Types**

| Type       | Purpose                  |
| ---------- | ------------------------ |
| `feat`     | New feature              |
| `fix`      | Bug fix                  |
| `docs`     | Documentation updates    |
| `style`    | UI/styling changes       |
| `refactor` | Code improvements        |
| `perf`     | Performance optimization |

---

## 4. Push Your Changes

Push your branch to your forked repository.

```bash
git push origin feature/your-branch-name
```

---

## 5. Open a Pull Request

After pushing your changes:

1. Open your fork on GitHub
2. Click **Compare & Pull Request**
3. Add a clear title and description
4. Submit the pull request

---

# ↪️ Issue Assignment Process

To ensure fair and efficient issue management, please follow these steps:

1. **Browse open issues** — Check the [Issues](https://github.com/PankajSingh34/AlgoBuddy/issues) tab for tasks labelled `good first issue` or `help wanted`.
2. **Comment to request assignment** — Leave a comment on the issue you'd like to work on (e.g., *"I'd like to work on this"*). Do not open a PR without being assigned first.
3. **Wait for assignment** — A maintainer will assign the issue to you. Work will only be reviewed from the assigned contributor.
4. **Submit within the deadline** — If a deadline is mentioned on the issue, please try to submit your PR within that timeframe. If you need more time, let us know in the issue thread.
5. **Avoid duplicate work** — Before starting, check that no one else is already assigned to the same issue.

> If you find a bug or want to suggest a feature that isn't already an issue, please open one first before working on it.

---

# ↪️ Pull Request Guidelines

Before submitting a PR:

- Ensure the project builds and runs correctly (`npm run dev`)
- Test changes on multiple screen sizes (mobile, tablet, desktop)
- Follow clean coding practices
- Avoid committing unnecessary files (e.g., `.env.local`, `node_modules`)
- Use meaningful commit messages following the conventions above
- Keep PRs focused on a single issue or topic
- Add screenshots or screen recordings for UI-related changes

---

# ↪️ Reporting Issues

When creating issues, please include:

- A clear, descriptive title
- A proper explanation of the problem
- Steps to reproduce the issue
- Expected vs. actual behaviour
- Screenshots or error logs, if applicable

---

# ↪️ Need Help?

If you need help while contributing:

- **Open an issue** on GitHub
- **Start a discussion** in the [Discussions](https://github.com/PankajSingh34/AlgoBuddy/discussions) tab
- **Ask in Discord** — [discord.gg/Gv2N4U3KAc](https://discord.gg/Gv2N4U3KAc)

We're happy to help new contributors!

---

# ↪️ Thank You

Thank you for contributing to AlgoBuddy 💙

Your contributions help make learning Data Structures & Algorithms more interactive and accessible for everyone.
