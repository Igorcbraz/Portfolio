import metadataJson from "@/data/metadata.json"
import { NextResponse } from "next/server"

export const revalidate = 21600 // 6h cache to avoid rate limits

const githubUser = metadataJson.social.github.username || "igorcbraz"
const githubApiBase = "https://api.github.com"

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
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "igorcbraz-portfolio",
    },
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error(`GitHub request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
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

    return NextResponse.json(payload)
  } catch (error) {
    console.error("/api/github error", error)
    if (lastSuccessfulPayload) {
      return NextResponse.json({ ...lastSuccessfulPayload, fromCache: true }, { status: 200 })
    }
    const fallback = buildFallback()
    return NextResponse.json(fallback, { status: 200 })
  }
}
