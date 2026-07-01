import metadataJson from "@/data/metadata.json"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const GITHUB_REVALIDATE_SECONDS = 21600 // 6h cache to avoid rate limits
export const dynamic = "force-dynamic"

const githubUser = metadataJson.social.github.username || "igorcbraz"
const githubApiBase = "https://api.github.com"
const githubToken = process.env.GITHUB_TOKEN

const TMP_CACHE_PATH = "/tmp/github-cache.json"
const BUILD_CACHE_PATH = path.join(process.cwd(), "data", "github-cache.json")

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

function getCache(): ApiPayload | null {
  if (lastSuccessfulPayload) {
    return lastSuccessfulPayload
  }

  try {
    if (fs.existsSync(TMP_CACHE_PATH)) {
      const data = fs.readFileSync(TMP_CACHE_PATH, "utf8")
      const parsed = JSON.parse(data) as ApiPayload
      if (parsed && parsed.userData && parsed.repos) {
        lastSuccessfulPayload = parsed
        return parsed
      }
    }
  } catch (e) {
    // Ignore
  }

  try {
    if (fs.existsSync(BUILD_CACHE_PATH)) {
      const data = fs.readFileSync(BUILD_CACHE_PATH, "utf8")
      const parsed = JSON.parse(data) as ApiPayload
      if (parsed && parsed.userData && parsed.repos) {
        lastSuccessfulPayload = parsed
        return parsed
      }
    }
  } catch (e) {
    // Ignore
  }

  return null
}

function saveCache(payload: ApiPayload) {
  lastSuccessfulPayload = payload

  try {
    const dir = path.dirname(TMP_CACHE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(TMP_CACHE_PATH, JSON.stringify(payload), "utf8")
  } catch (e) {
    // Ignore
  }

  try {
    const dir = path.dirname(BUILD_CACHE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(BUILD_CACHE_PATH, JSON.stringify(payload, null, 2), "utf8")
  } catch (e) {
    // Ignore
  }
}

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
  const cached = getCache()
  if (cached) {
    return { ...cached, fromCache: true }
  }

  return {
    userData: {
      metadata: metadataJson,
      github: {
        username: githubUser,
        totalStars: 100,
        totalForks: 16,
        totalWatchers: 100,
        totalRepos: 43,
        yearsOnGitHub: 5,
        yearsExperience: 4,
        createdAt: "2021-03-24T00:00:00Z",
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

    saveCache(payload)

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${GITHUB_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
      },
    })
  } catch (error) {
    console.error("/api/github error", error)
    const cached = getCache()
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true }, {
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

