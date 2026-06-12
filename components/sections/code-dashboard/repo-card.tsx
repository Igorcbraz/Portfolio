"use client";
import { motion } from "framer-motion";
import { GitHubRepo } from "./types";
import { getLangBgClass, getLangShadowClass } from "./constants";

export interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
  reposPerPage: number;
  inView: boolean;
  dictionary: Record<string, string>;
  formatDate: (d: string) => string;
  formatSize: (kb: number) => string;
}

export function RepoCard({
  repo,
  index,
  reposPerPage,
  inView,
  dictionary,
  formatDate,
  formatSize,
}: RepoCardProps) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        delay: (index % reposPerPage) * 0.07,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <div className="absolute inset-0 rounded-lg border border-[oklch(0.62_0.22_41.1/0)] group-hover:border-[oklch(0.62_0.22_41.1/0.45)] transition-[border-color] duration-200 pointer-events-none z-20" />
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-[oklch(0.10_0_0/0.60)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.55_0.18_25/0.55)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.70_0.18_90/0.55)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0_0/0.35)]" />
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${getLangBgClass(repo.language)} ${getLangShadowClass(repo.language)}`}
          />
          <span className="text-[10px] font-mono text-muted-foreground">
            {repo.language}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold font-display text-foreground group-hover:text-primary transition-colors duration-200 truncate text-base">
                {repo.name}
              </h3>
              {repo.stars > 10 && (
                <span className="shrink-0 px-2 py-0.5 bg-[oklch(0.62_0.22_41.1/0.07)] text-primary text-[10px] font-display rounded-full font-semibold uppercase tracking-widest border border-[oklch(0.62_0.22_41.1/0.20)]">
                  {dictionary.badgePopular}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 w-7 h-7 rounded-md bg-[oklch(0.62_0.22_41.1/0.08)] flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-black transition-all duration-200">
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {repo.description}
        </p>

        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 bg-[oklch(0.62_0.22_41.1/0.06)] text-primary text-[10px] rounded font-medium border border-[oklch(0.62_0.22_41.1/0.12)] font-mono"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="px-2 py-0.5 bg-card text-muted-foreground text-[10px] rounded border border-border/30">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {repo.stars}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-primary"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                />
              </svg>
              {repo.forks}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {repo.watchers}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{formatSize(repo.size)}</span>
            <span className="opacity-40">·</span>
            <span>{formatDate(repo.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.62_0.22_41.1/0.05),transparent)] pointer-events-none" />
    </motion.a>
  );
}