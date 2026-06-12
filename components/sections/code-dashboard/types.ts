export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  watchers: number;
  openIssues: number;
  updatedAt: string;
  size: number;
  topics: string[];
}