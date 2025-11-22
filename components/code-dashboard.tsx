"use client"

import { useEffect, useState } from "react"
import { sendGAEvent } from '@next/third-parties/google'
import { useUser } from "@/contexts/UserContext"
import { useLocale } from "@/contexts/LocaleContext"

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

export function CodeDashboard() {
  const { repos, reposLoading, userData } = useUser()
  const { dictionary } = useLocale()
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated" | "size">("stars")
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const reposPerPage = isMobile ? 3 : 6

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let filtered = repos

    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedLanguage) {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage)
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stars - a.stars
        case "forks":
          return b.forks - a.forks
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "size":
          return b.size - a.size
        default:
          return 0
      }
    })

    setFilteredRepos(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedLanguage, repos, sortBy])

  const languages = Array.from(new Set(repos.map((r) => r.language)))
  const totalStars = userData?.github.totalStars || 0
  const totalForks = userData?.github.totalForks || 0
  const totalWatchers = userData?.github.totalWatchers || 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "hoje"
    if (diffDays < 7) return `${diffDays}d atrás`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m atrás`
    return `${Math.floor(diffDays / 365)}a atrás`
  }

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb}KB`
    return `${(kb / 1024).toFixed(1)}MB`
  }

  const totalPages = Math.ceil(filteredRepos.length / reposPerPage)
  const startIndex = (currentPage - 1) * reposPerPage
  const endIndex = startIndex + reposPerPage
  const currentRepos = filteredRepos.slice(startIndex, endIndex)

  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language !== "Unknown") {
      acc[repo.language] = (acc[repo.language] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const totalReposWithLang = topLanguages.reduce((sum, [, count]) => sum + count, 0)

  return (
    <section className="relative min-h-screen py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {dictionary.code.title.split(" ").shift()} <span className="text-primary">{dictionary.code.title.split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {dictionary.code.subtitle}
          </p>
        </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: dictionary.code.totalStars,
              value: totalStars,
              bgColor: "bg-yellow-500/10",
              textColor: "text-yellow-500",
              borderColor: "border-yellow-500/30",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )
            },
            {
              label: dictionary.code.totalForks,
              value: totalForks,
              bgColor: "bg-blue-500/10",
              textColor: "text-blue-500",
              borderColor: "border-blue-500/30",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
              )
            },
            {
              label: dictionary.code.repositories,
              value: repos.length,
              bgColor: "bg-purple-500/10",
              textColor: "text-purple-500",
              borderColor: "border-purple-500/30",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
              )
            },
            {
              label: dictionary.code.watchers,
              value: totalWatchers,
              bgColor: "bg-green-500/10",
              textColor: "text-green-500",
              borderColor: "border-green-500/30",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-card/50 backdrop-blur-sm border ${stat.borderColor} rounded-lg p-6 hover:bg-card/80 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden`}
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} ${stat.textColor} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border/30 rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-6">{dictionary.code.topLanguagesTitle}</h3>
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {topLanguages.map(([lang, count]) => {
                const percentage = (count / totalReposWithLang) * 100
                const colors: Record<string, string> = {
                  TypeScript: "bg-blue-500",
                  JavaScript: "bg-yellow-500",
                  Python: "bg-green-500",
                  Java: "bg-red-500",
                  Go: "bg-cyan-500",
                  Rust: "bg-orange-500",
                  React: "bg-sky-500",
                  CSS: "bg-pink-500",
                }
                const color = colors[lang] || "bg-primary"

                return (
                  <div key={lang}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{lang}</span>
                      <span className="text-xs text-muted-foreground">
                        {count} repos ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

            <div className="bg-card border border-border/30 rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-6">{dictionary.code.activityStatsTitle}</h3>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">{dictionary.code.engagement.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {totalStars + totalForks + totalWatchers} {dictionary.code.engagement.interactions}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalStars / Math.max(totalStars, totalForks, totalWatchers)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{totalStars} ★</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalForks / Math.max(totalStars, totalForks, totalWatchers)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{totalForks} forks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalWatchers / Math.max(totalStars, totalForks, totalWatchers)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{totalWatchers} watch</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">{dictionary.code.quality.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-green-500">{dictionary.code.quality.withDescription}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {repos.filter(r => r.description && r.description !== "No description available").length}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {((repos.filter(r => r.description && r.description !== "No description available").length / repos.length) * 100).toFixed(0)}% {dictionary.code.quality.percentSuffix}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium text-purple-500">{dictionary.code.quality.featured}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {repos.filter(r => r.stars > 0).length}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {dictionary.code.quality.withStars}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-blue-500">{dictionary.code.quality.active}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {repos.filter(r => {
                        const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(r.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
                        return daysSinceUpdate < 180
                      }).length}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {dictionary.code.quality.last6Months}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-orange-500">{dictionary.code.quality.withTopics}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {repos.filter(r => r.topics && r.topics.length > 0).length}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {dictionary.code.quality.wellDocumented}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={dictionary.code.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-card border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-4 py-3 pr-10 bg-card border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all appearance-none"
              >
                <option value="stars">{dictionary.code.sort.stars}</option>
                <option value="forks">{dictionary.code.sort.forks}</option>
                <option value="updated">{dictionary.code.sort.updated}</option>
                <option value="size">{dictionary.code.sort.size}</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="lg:hidden overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => {
                      sendGAEvent('event', 'code_dashboard_all_languages_click', { label: dictionary.code.all });
                      setSelectedLanguage(null);
                    }}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === null
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {dictionary.code.all}
                </button>
                {languages
                  .filter((l) => l !== "Unknown")
                  .sort()
                  .map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        sendGAEvent('event', 'code_dashboard_language_click', { label: lang });
                        setSelectedLanguage(lang);
                      }}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedLanguage === lang
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-wrap gap-2">
              <button
                onClick={() => {
                  sendGAEvent('event', 'code_dashboard_all_languages_click', { label: 'All Languages' });
                  setSelectedLanguage(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === null
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {dictionary.code.all}
              </button>
              {languages
                .filter((l) => l !== "Unknown")
                .sort()
                .map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      sendGAEvent('event', 'code_dashboard_language_click', { label: lang });
                      setSelectedLanguage(lang);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedLanguage === lang
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
            </div>

            <div className="lg:hidden absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none"></div>
          </div>

          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredRepos.length} {filteredRepos.length === 1 ? dictionary.code.foundSingular : dictionary.code.foundPlural}
            </span>
            {(searchTerm || selectedLanguage) && (
              <button
                onClick={() => {
                  sendGAEvent('event', 'code_dashboard_clear_filters_click', { label: 'Clear Filters' });
                  setSearchTerm("")
                  setSelectedLanguage(null)
                }}
                className="text-primary hover:underline"
              >
                {dictionary.code.clearFilters}
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reposLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : currentRepos.length > 0 ? (
            currentRepos.map((repo, index) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-card border border-border/30 rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {repo.name}
                        </h3>
                        {repo.stars > 10 && (
                          <span className="shrink-0 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] rounded-full font-medium">
                            {dictionary.code.badgePopular}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>

                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-md font-medium border border-primary/10"
                        >
                          #{topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-[10px] rounded-md">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-foreground font-medium">{repo.stars}</span>
                      <span className="text-muted-foreground text-xs">{dictionary.code.smallLabels.stars}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                      </svg>
                      <span className="text-foreground font-medium">{repo.forks}</span>
                      <span className="text-muted-foreground text-xs">{dictionary.code.smallLabels.forks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-foreground font-medium">{repo.watchers}</span>
                      <span className="text-muted-foreground text-xs">{dictionary.code.smallLabels.watch}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-foreground font-medium">{repo.openIssues}</span>
                      <span className="text-muted-foreground text-xs">{dictionary.code.smallLabels.issues}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {repo.language}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatSize(repo.size)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(repo.updatedAt)}</span>
                      <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-muted-foreground">{dictionary.code.noResults}</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => {
                sendGAEvent('event', 'code_dashboard_prev_page_click', { label: 'Previous Page' });
                setCurrentPage(prev => Math.max(prev - 1, 1));
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-card border border-border/30 text-foreground hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        sendGAEvent('event', 'code_dashboard_page_click', { label: `Page ${page}` });
                        setCurrentPage(page);
                      }}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-card border border-border/30 text-foreground hover:border-primary/50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="text-muted-foreground px-2">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => {
                sendGAEvent('event', 'code_dashboard_next_page_click', { label: 'Next Page' });
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-card border border-border/30 text-foreground hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
