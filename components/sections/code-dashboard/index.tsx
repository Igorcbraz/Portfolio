"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { sendGAEvent } from "@next/third-parties/google";
import { useUser } from "@/contexts/UserContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useInView } from "@/hooks/use-animations";
import { SplitText } from "@/components/ui/split-text";
import { DecryptedText } from "@/components/ui/decrypted-text";
import { BlurText } from "@/components/ui/blur-text";

import { GitHubRepo } from "./types";
import { CODE_SNIPPETS, getLangBgClass } from "./constants";
import { FloatingCodeLine } from "@/components/features/floating-code-line";
import { StatCard } from "@/components/features/stat-card";
import { RepoOrbitPanel } from "./repo-orbit-panel";
import { RepoCard } from "./repo-card";
import { LanguageBar } from "./language-bar";
import { LanguageFilterBtn } from "./language-filter-btn";

export function CodeDashboard() {
  const { repos, reposLoading, userData } = useUser();
  const { dictionary } = useLocale();
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated" | "size">(
    "stars",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const reposPerPage = isMobile ? 3 : 6;

  const { ref: sectionRef, isInView: sectionInView } = useInView({
    threshold: 0.08,
    triggerOnce: true,
  });
  const { ref: statsRef, isInView: statsInView } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });
  const { ref: cardsRef, isInView: cardsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let filtered = repos;
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.topics.some((t) =>
            t.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }
    if (selectedLanguage)
      filtered = filtered.filter((r) => r.language === selectedLanguage);
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stars - a.stars;
        case "forks":
          return b.forks - a.forks;
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "size":
          return b.size - a.size;
        default:
          return 0;
      }
    });
    setFilteredRepos(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedLanguage, repos, sortBy]);

  const languages = Array.from(new Set(repos.map((r) => r.language)));
  const totalStars = userData?.github.totalStars ?? 0;
  const totalForks = userData?.github.totalForks ?? 0;
  const totalWatchers = userData?.github.totalWatchers ?? 0;

  const formatDate = (dateString: string) => {
    const diff = Math.ceil(
      (Date.now() - new Date(dateString).getTime()) / 86400000,
    );
    if (diff <= 1) return "today";
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
    return `${Math.floor(diff / 365)}y ago`;
  };

  const formatSize = (kb: number) =>
    kb < 1024 ? `${kb}KB` : `${(kb / 1024).toFixed(1)}MB`;

  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);
  const currentRepos = filteredRepos.slice(
    (currentPage - 1) * reposPerPage,
    currentPage * reposPerPage,
  );

  const languageStats = repos.reduce(
    (acc, r) => {
      if (r.language !== "Unknown")
        acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const totalReposWithLang = topLanguages.reduce((s, [, c]) => s + c, 0);

  const STAT_CARDS = [
    {
      label: dictionary.code.totalStars,
      value: totalStars,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      label: dictionary.code.totalForks,
      value: totalForks,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
          />
        </svg>
      ),
    },
    {
      label: dictionary.code.repositories,
      value: repos.length,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
        </svg>
      ),
    },
    {
      label: dictionary.code.watchers,
      value: totalWatchers,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="code"
      className="relative min-h-screen py-24 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 hero-grid-pattern opacity-100 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,var(--background)_100%)]" />

      <div className="absolute pointer-events-none top-[-10%] left-[-5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle,oklch(0.62_0.22_41.1/0.12)_0%,transparent_70%)] rounded-full blur-2xl animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="absolute pointer-events-none bottom-[-15%] right-[-8%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] bg-[radial-gradient(circle,oklch(0.55_0.18_260/0.07)_0%,transparent_70%)] rounded-full blur-[60px] animate-[pulse_8s_ease-in-out_infinite] [animation-delay:2s]" />

      <FloatingCodeLine
        text={CODE_SNIPPETS[0]}
        className="top-[12%] left-[2%] animate-[cd-float_9s_ease-in-out_0s_infinite]"
      />
      <FloatingCodeLine
        text={CODE_SNIPPETS[2]}
        className="top-[28%] right-[2%] animate-[cd-float2_11s_ease-in-out_1.5s_infinite]"
      />
      <FloatingCodeLine
        text={CODE_SNIPPETS[4]}
        className="bottom-[20%] left-[3%] animate-[cd-float_13s_ease-in-out_3s_infinite]"
      />
      <FloatingCodeLine
        text={CODE_SNIPPETS[6]}
        className="bottom-[35%] right-[3%] animate-[cd-float2_10s_ease-in-out_2s_infinite]"
      />

      <div
        ref={sectionRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4 font-display">
            <DecryptedText
              text={dictionary.code.sectionLabel}
              speed={30}
              delay={0}
              className="text-muted-foreground/60"
            />
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground font-display mb-5">
            <SplitText
              text={dictionary.code.title}
              splitType="words"
              stepDelay={65}
              delay={0}
              threshold={0.08}
            />{" "}
            <span className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]">
              {dictionary.code.titleHighlight}
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            <BlurText
              text={dictionary.code.subtitle}
              animateBy="words"
              direction="top"
              delay={0}
              stepDelay={25}
              className="text-muted-foreground"
              threshold={0.08}
            />
          </p>
        </div>

        <div
          ref={statsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {STAT_CARDS.map((s, i) => (
            <StatCard
              key={i}
              label={s.label}
              value={s.value}
              icon={s.icon}
              inView={statsInView}
              delay={i * 0.08}
            />
          ))}
        </div>

        <m.div
          className="grid lg:grid-cols-2 gap-5 mb-12"
          initial={{ opacity: 0, y: 32 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30 bg-[oklch(0.10_0_0/0.50)]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.55_0.18_25/0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.70_0.18_90/0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.20_145/0.6)]" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground/60">
                languages.json
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-5">
                {dictionary.code.topLanguagesTitle}
              </h3>
              {topLanguages.map(([lang, count], idx) => (
                <LanguageBar
                  key={lang}
                  lang={lang}
                  count={count}
                  total={totalReposWithLang}
                  idx={idx}
                  inView={statsInView}
                />
              ))}
            </div>
          </div>

          <RepoOrbitPanel repos={repos} inView={statsInView} />
        </m.div>

        <m.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
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
              <input
                type="text"
                placeholder={dictionary.code.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border/40 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[oklch(0.62_0.22_41.1/0.50)] focus:ring-1 focus:ring-[oklch(0.62_0.22_41.1/0.25)] transition-all backdrop-blur-sm font-mono"
              />
            </div>

            <div className="relative">
              <label htmlFor="repo-sort" className="sr-only">
                Sort repositories
              </label>
              <select
                id="repo-sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "stars" | "forks" | "updated" | "size",
                  )
                }
                className="w-full sm:w-auto pl-4 pr-9 py-2.5 bg-card/60 border border-border/40 rounded-lg text-sm text-foreground focus:outline-none focus:border-[oklch(0.62_0.22_41.1/0.50)] transition-all appearance-none cursor-pointer backdrop-blur-sm font-mono"
              >
                <option value="stars">{dictionary.code.sort.stars}</option>
                <option value="forks">{dictionary.code.sort.forks}</option>
                <option value="updated">{dictionary.code.sort.updated}</option>
                <option value="size">{dictionary.code.sort.size}</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative lg:hidden">
            <div className="scrollbar-none overflow-x-auto">
              <div className="flex gap-2 pb-1">
                <LanguageFilterBtn
                  active={selectedLanguage === null}
                  onClick={() => {
                    sendGAEvent("event", "code_dashboard_all_languages_click", {
                      label: "All",
                    });
                    setSelectedLanguage(null);
                  }}
                  label={dictionary.code.all}
                />
                {languages
                  .filter((l) => l !== "Unknown")
                  .sort()
                  .map((lang) => (
                    <LanguageFilterBtn
                      key={lang}
                      active={selectedLanguage === lang}
                      onClick={() => {
                        sendGAEvent("event", "code_dashboard_language_click", {
                          label: lang,
                        });
                        setSelectedLanguage(lang);
                      }}
                      label={lang}
                      bgClass={getLangBgClass(lang)}
                    />
                  ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 bottom-0 w-10 bg-linear-to-l from-background to-transparent pointer-events-none" />
          </div>

          <div className="hidden lg:flex flex-wrap gap-2">
            <LanguageFilterBtn
              active={selectedLanguage === null}
              onClick={() => {
                sendGAEvent("event", "code_dashboard_all_languages_click", {
                  label: "All Languages",
                });
                setSelectedLanguage(null);
              }}
              label={dictionary.code.all}
            />
            {languages
              .filter((l) => l !== "Unknown")
              .sort()
              .map((lang) => (
                <LanguageFilterBtn
                  key={lang}
                  active={selectedLanguage === lang}
                  onClick={() => {
                    sendGAEvent("event", "code_dashboard_language_click", {
                      label: lang,
                    });
                    setSelectedLanguage(lang);
                  }}
                  label={lang}
                  bgClass={getLangBgClass(lang)}
                />
              ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>
              <span className="text-primary">{filteredRepos.length}</span>{" "}
              {filteredRepos.length === 1
                ? dictionary.code.foundSingular
                : dictionary.code.foundPlural}
            </span>
            {(searchTerm || selectedLanguage) && (
              <button
                onClick={() => {
                  sendGAEvent("event", "code_dashboard_clear_filters_click", {
                    label: "Clear Filters",
                  });
                  setSearchTerm("");
                  setSelectedLanguage(null);
                }}
                className="text-primary hover:underline transition-all"
              >
                {dictionary.code.clearFilters}
              </button>
            )}
          </div>
        </m.div>

        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {reposLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative w-12 h-12">
                <m.div
                  className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                fetching repos...
              </p>
            </div>
          ) : currentRepos.length > 0 ? (
            <AnimatePresence mode="wait">
              {currentRepos.map((repo, index) => (
                <RepoCard
                  key={`${repo.name}-${currentPage}`}
                  repo={repo}
                  index={index}
                  reposPerPage={reposPerPage}
                  inView={cardsInView}
                  dictionary={dictionary.code as Record<string, string>}
                  formatDate={formatDate}
                  formatSize={formatSize}
                />
              ))}
            </AnimatePresence>
          ) : (
            <m.div
              className="col-span-full flex flex-col items-center justify-center py-16 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <svg
                className="w-10 h-10 text-muted-foreground/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-muted-foreground font-mono text-sm">
                {dictionary.code.noResults}
              </p>
            </m.div>
          )}
        </div>

        {totalPages > 1 && (
          <m.div
            className="flex items-center justify-center gap-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => {
                sendGAEvent("event", "code_dashboard_prev_page_click", {
                  label: "Previous Page",
                });
                setCurrentPage((p) => Math.max(p - 1, 1));
              }}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-9 h-9 rounded-lg bg-card/60 border border-border/40 text-foreground hover:border-[oklch(0.62_0.22_41.1/0.45)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          sendGAEvent("event", "code_dashboard_page_click", {
                            label: `Page ${page}`,
                          });
                          setCurrentPage(page);
                        }}
                        className={`w-9 h-9 rounded-lg text-sm font-mono font-medium transition-all ${currentPage === page
                          ? "bg-primary text-black"
                          : "bg-card/60 border border-border/40 text-foreground hover:border-[oklch(0.62_0.22_41.1/0.45)] backdrop-blur-sm"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="text-muted-foreground px-1 font-mono text-sm"
                      >
                        …
                      </span>
                    );
                  }
                  return null;
                },
              )}
            </div>

            <button
              onClick={() => {
                sendGAEvent("event", "code_dashboard_next_page_click", {
                  label: "Next Page",
                });
                setCurrentPage((p) => Math.min(p + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="w-9 h-9 rounded-lg bg-card/60 border border-border/40 text-foreground hover:border-[oklch(0.62_0.22_41.1/0.45)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </m.div>
        )}
      </div>
    </section>
  );
}
