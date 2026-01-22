"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GitHubRepo {
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

interface SiteMetadata {
  site: {
    title: string
    description: string
    keywords: string[]
    url: string
    locale: string
    themeColor: string
  }
  author: {
    name: string
    role: string
    bio: string
    email: string
    location: string
  }
  social: {
    github: { username: string; url: string }
    linkedin: { username: string; url: string }
  }
  openGraph: {
    type: string
    image: string
    imageWidth: number
    imageHeight: number
  }
  icons: {
    light: string
    dark: string
    svg: string
    apple: string
  }
  analytics: {
    vercel: boolean
    googleAnalytics: string
  }
  viewport: {
    width: string
    initialScale: number
    maximumScale: number
    userScalable: boolean
  }
}

interface UserData {
  metadata: SiteMetadata
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

interface GithubFetchMeta {
  fromCache: boolean
  cachedAt?: string
}

interface UserContextType {
  userData: UserData | null
  loading: boolean
  error: string | null
  meta: GithubFetchMeta
  refreshData: () => Promise<void>
  repos: GitHubRepo[]
  reposLoading: boolean
  reposError: string | null
  refreshRepos: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

import metadataJson from '@/data/metadata.json'

const defaultUserData: UserData = {
  metadata: metadataJson as SiteMetadata,
  github: {
    username: metadataJson.social.github.username,
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalRepos: 0,
    yearsOnGitHub: 5,
    yearsExperience: 4,
    createdAt: '',
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
}

const defaultMeta: GithubFetchMeta = { fromCache: true, cachedAt: undefined }

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError, setReposError] = useState<string | null>(null)
  const [meta, setMeta] = useState<GithubFetchMeta>(defaultMeta)

  const refreshFromApi = async () => {
    setLoading(true)
    setReposLoading(true)
    setError(null)
    setReposError(null)

    try {
      const response = await fetch('/api/github')
      if (!response.ok) throw new Error('Failed to fetch cached GitHub data')
      const payload = await response.json() as { userData: UserData; repos: GitHubRepo[]; fromCache?: boolean; cachedAt?: string }

      setUserData(payload.userData)
      setRepos(payload.repos)
      setMeta({ fromCache: Boolean(payload.fromCache), cachedAt: payload.cachedAt })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setReposError(err instanceof Error ? err.message : 'Failed to fetch repos')
      setUserData(defaultUserData)
      setRepos([])
      setMeta(defaultMeta)
    } finally {
      setLoading(false)
      setReposLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await refreshFromApi()
    }
    initializeData()
  }, [])

  return (
    <UserContext.Provider value={{ userData, loading, error, meta, refreshData: refreshFromApi, repos, reposLoading, reposError, refreshRepos: refreshFromApi }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
