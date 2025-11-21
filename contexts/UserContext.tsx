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
    twitter: { username: string; url: string }
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
    twitter?: string
  }
}

interface UserContextType {
  userData: UserData | null
  loading: boolean
  error: string | null
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
    twitter: metadataJson.social.twitter.url || undefined,
  },
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError, setReposError] = useState<string | null>(null)

  const fetchGitHubData = async (): Promise<UserData> => {
    try {
      const userResponse = await fetch('https://api.github.com/users/igorcbraz')
      if (!userResponse.ok) throw new Error('Failed to fetch user data')
      const userData = await userResponse.json()

      const createdDate = new Date(userData.created_at)
      const now = new Date()
      const yearsDiff = now.getFullYear() - createdDate.getFullYear()
      const monthsDiff = now.getMonth() - createdDate.getMonth()
      const yearsOnGitHub = monthsDiff < 0 ? yearsDiff - 1 : yearsDiff
      const yearsExperience = yearsOnGitHub > 1 ? yearsOnGitHub - 1 : 1

      return {
        metadata: defaultUserData.metadata,
        github: {
          username: userData.login,
          totalStars: 0,
          totalForks: 0,
          totalWatchers: 0,
          totalRepos: userData.public_repos,
          yearsOnGitHub,
          yearsExperience,
          createdAt: userData.created_at,
        },
        personal: defaultUserData.personal,
        social: defaultUserData.social,
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
      throw error
    }
  }

  const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
    try {
      const reposResponse = await fetch('https://api.github.com/users/igorcbraz/repos?per_page=100')
      if (!reposResponse.ok) throw new Error('Failed to fetch repos data')
      const reposData = await reposResponse.json()

      const formattedRepos: GitHubRepo[] = reposData.map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        watchers: repo.watchers_count,
        openIssues: repo.open_issues_count,
        updatedAt: repo.updated_at,
        size: repo.size,
        topics: repo.topics || [],
      }))

      return formattedRepos
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      throw error
    }
  }

  const refreshRepos = async () => {
    setReposLoading(true)
    setReposError(null)

    try {
      const fetchedRepos = await fetchGitHubRepos()
      setRepos(fetchedRepos)

      const totalStars = fetchedRepos.reduce((acc, repo) => acc + repo.stars, 0)
      const totalForks = fetchedRepos.reduce((acc, repo) => acc + repo.forks, 0)
      const totalWatchers = fetchedRepos.reduce((acc, repo) => acc + repo.watchers, 0)

      setUserData(prevData => {
        if (!prevData) return prevData

        return {
          ...prevData,
          github: {
            ...prevData.github,
            totalStars,
            totalForks,
            totalWatchers,
          },
        }
      })
    } catch (err) {
      setReposError(err instanceof Error ? err.message : 'Failed to fetch repos')
      setRepos([])
    } finally {
      setReposLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchGitHubData()
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setUserData(defaultUserData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await refreshData()
      await refreshRepos()
    }
    initializeData()
  }, [])

  return (
    <UserContext.Provider value={{ userData, loading, error, refreshData, repos, reposLoading, reposError, refreshRepos }}>
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
