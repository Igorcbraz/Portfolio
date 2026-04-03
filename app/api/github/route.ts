import metadataJson from "@/data/metadata.json"
import { NextResponse } from "next/server"

const GITHUB_REVALIDATE_SECONDS = 21600 // 6h cache to avoid rate limits
export const dynamic = "force-dynamic"

const githubUser = metadataJson.social.github.username || "igorcbraz"
const githubApiBase = "https://api.github.com"
const githubToken = process.env.GITHUB_TOKEN

type ApiPayload = {
  userData: UserData
  repos: RepoInfo[]
  fromCache: boolean
  cachedAt?: string
}

type RepoInfo = {
  name: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  watchers: number
  openIssues: number
  updatedAt: string
  size: number
  topics: string[]
}

type UserData = {
  metadata: typeof metadataJson
  github: {
    username: string
    totalStars: number
    totalForks: number
    totalWatchers: number
    totalRepos: number
    yearsOnGitHub: number
    yearsExperience: number
    createdAt: string
  }
  personal: {
    name: string
    title: string
    bio: string
    location: string
    email: string
    website: string
  }
  social: {
    github: string
    linkedin: string
  }
}

let lastSuccessfulPayload: ApiPayload | null = null

async function fetchJson<T>(url: string) {
  const baseHeaders: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "igorcbraz-portfolio",
  }

  const requestInit = {
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  }

  const fetchWithHeaders = async (headers: HeadersInit) => {
    const response = await fetch(url, {
      headers,
      ...requestInit,
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      const rateRemaining = response.headers.get("x-ratelimit-remaining")
      const rateReset = response.headers.get("x-ratelimit-reset")
      throw new Error(
        `GitHub request failed: ${response.status} ${response.statusText}; remaining=${rateRemaining ?? "unknown"}; reset=${rateReset ?? "unknown"}; body=${body.slice(0, 300)}`
      )
    }

    return response.json() as Promise<T>
  }

  if (githubToken) {
    try {
      return await fetchWithHeaders({
        ...baseHeaders,
        Authorization: `Bearer ${githubToken}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      const isAuthOrForbidden = message.includes(" 401 ") || message.includes(" 403 ")

      if (!isAuthOrForbidden) {
        throw error
      }

      console.error("GitHub token request failed, retrying without token", {
        url,
        reason: message,
      })
    }
  }

  return fetchWithHeaders(baseHeaders)
}

function buildFallback(): { userData: UserData; repos: RepoInfo[]; fromCache: boolean } {
  return {
    userData: {
      metadata: metadataJson,
      github: {
        username: githubUser,
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        totalRepos: 0,
        yearsOnGitHub: 1,
        yearsExperience: 1,
        createdAt: "",
      },
      personal: {
        name: metadataJson.author.name,
        title: metadataJson.author.role,
        bio: metadataJson.author.bio,
        location: metadataJson.author.location,
        email: metadataJson.author.email,
        website: metadataJson.site.url,
      },
      social: {
        github: metadataJson.social.github.url,
        linkedin: metadataJson.social.linkedin.url,
      },
    },
    repos: [],
    fromCache: true,
  }
}

export async function GET() {
  try {
    const [user, repos] = await Promise.all([
      fetchJson<any>(`${githubApiBase}/users/${githubUser}`),
      fetchJson<any[]>(`${githubApiBase}/users/${githubUser}/repos?per_page=100&sort=updated`),
    ])

    const totals = repos.reduce(
      (acc, repo) => {
        acc.totalStars += repo.stargazers_count || 0
        acc.totalForks += repo.forks_count || 0
        acc.totalWatchers += repo.watchers_count || 0
        return acc
      },
      { totalStars: 0, totalForks: 0, totalWatchers: 0 }
    )

    const createdDate = new Date(user.created_at)
    const now = new Date()
    const yearsDiff = now.getFullYear() - createdDate.getFullYear()
    const monthsDiff = now.getMonth() - createdDate.getMonth()
    const yearsOnGitHub = monthsDiff < 0 ? yearsDiff - 1 : yearsDiff
    const yearsExperience = Math.max(1, yearsOnGitHub - 1)

    const formattedRepos: RepoInfo[] = repos.map((repo) => ({
      name: repo.name,
      description: repo.description || "No description available",
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "Unknown",
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at,
      size: repo.size,
      topics: repo.topics || [],
    }))

    const payload: ApiPayload = {
      userData: {
        metadata: metadataJson,
        github: {
          username: user.login,
          totalStars: totals.totalStars,
          totalForks: totals.totalForks,
          totalWatchers: totals.totalWatchers,
          totalRepos: user.public_repos,
          yearsOnGitHub,
          yearsExperience,
          createdAt: user.created_at,
        },
        personal: {
          name: metadataJson.author.name,
          title: metadataJson.author.role,
          bio: metadataJson.author.bio,
          location: metadataJson.author.location,
          email: metadataJson.author.email,
          website: metadataJson.site.url,
        },
        social: {
          github: metadataJson.social.github.url,
          linkedin: metadataJson.social.linkedin.url,
        },
      },
      repos: formattedRepos,
      fromCache: false,
      cachedAt: new Date().toISOString(),
    }

    lastSuccessfulPayload = payload

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${GITHUB_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
      },
    })
  } catch (error) {
    console.error("/api/github error", error)
    if (lastSuccessfulPayload) {
      return NextResponse.json({ ...lastSuccessfulPayload, fromCache: true }, {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      })
    }
    const fallback = buildFallback()
    return NextResponse.json(fallback, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }
}
