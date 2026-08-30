import { NextResponse } from "next/server";

// GET /api/coding-profiles/fetch?platform=leetcode&username=shruti
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const username = searchParams.get("username")?.trim();

  if (!platform || !username) {
    return NextResponse.json({ error: "Missing platform or username" }, { status: 400 });
  }

  try {
    switch (platform) {
      case "leetcode":
        return await fetchLeetCode(username);
      case "codeforces":
        return await fetchCodeforces(username);
      case "codechef":
        return await fetchCodeChef(username);
      case "github":
        return await fetchGitHub(username);
      default:
        return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
    }
  } catch (err) {
    console.error(`[coding-profiles] ${platform} error:`, err);
    return NextResponse.json({ error: "Failed to fetch stats. Check the username and try again." }, { status: 500 });
  }
}

// ── LeetCode ──────────────────────────────────────────────────────────────────
// Uses LeetCode's public GraphQL endpoint
async function fetchLeetCode(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) throw new Error("LeetCode API error");

  const json = await res.json();
  const matchedUser = json?.data?.matchedUser;

  if (!matchedUser) {
    return NextResponse.json({ error: `LeetCode user "${username}" not found` }, { status: 404 });
  }

  const allEntry = matchedUser.submitStats?.acSubmissionNum?.find((e) => e.difficulty === "All");
  const solved = allEntry?.count ?? 0;

  return NextResponse.json({ platform: "leetcode", username, value: solved });
}

// ── Codeforces ────────────────────────────────────────────────────────────────
// Official public Codeforces API
async function fetchCodeforces(username) {
  const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`, {
    next: { revalidate: 3600 },
  });

  const json = await res.json();

  if (json.status !== "OK") {
    return NextResponse.json({ error: `Codeforces user "${username}" not found` }, { status: 404 });
  }

  const rating = json.result?.[0]?.rating ?? 0;
  return NextResponse.json({ platform: "codeforces", username, value: rating });
}

// ── CodeChef ──────────────────────────────────────────────────────────────────
// Uses community wrapper API (no official public API exists)
async function fetchCodeChef(username) {
  const res = await fetch(`https://codechef-api.vercel.app/handle/${encodeURIComponent(username)}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `CodeChef user "${username}" not found` }, { status: 404 });
  }

  const json = await res.json();

  if (json.success === false) {
    return NextResponse.json({ error: `CodeChef user "${username}" not found` }, { status: 404 });
  }

  // stars come as a string like "3★" — extract the number
  const starsRaw = json.stars ?? "0★";
  const stars = parseInt(starsRaw.replace("★", ""), 10) || 0;

  return NextResponse.json({ platform: "codechef", username, value: stars });
}

// ── GitHub ────────────────────────────────────────────────────────────────────
// Official GitHub REST API — returns public repo count
// (contribution graph requires GraphQL + auth token, out of scope here)
async function fetchGitHub(username) {
  const headers = { "User-Agent": "AlgoBuddy-App" };

  // Use GitHub token from env if available to avoid rate limiting
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (res.status === 404) {
    return NextResponse.json({ error: `GitHub user "${username}" not found` }, { status: 404 });
  }

  if (!res.ok) throw new Error("GitHub API error");

  const json = await res.json();
  const publicRepos = json.public_repos ?? 0;

  return NextResponse.json({ platform: "github", username, value: publicRepos });
}