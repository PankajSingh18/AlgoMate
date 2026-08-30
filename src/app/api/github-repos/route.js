import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

// GET /api/github-repos?username=shrutssss
export async function GET(request) {
  const authResult = await getAuthenticatedUser();
  if (!authResult.success) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const headers = { "User-Agent": "AlgoBuddy-App" };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
      { headers, next: { revalidate: 3600 } }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: `GitHub user "${username}" not found` }, { status: 404 });
    }

    if (!res.ok) throw new Error("GitHub API error");

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Unexpected GitHub API response" }, { status: 502 });
    }

    const repos = data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        topics: repo.topics || [],
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
      }));

    return NextResponse.json({ repos });
  } catch (err) {
    console.error("[github-repos]", err);
    return NextResponse.json({ error: "Failed to fetch GitHub repos" }, { status: 500 });
  }
}
