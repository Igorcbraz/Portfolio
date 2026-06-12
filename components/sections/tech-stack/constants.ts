import { Database, Cloud, Layout, Server, Terminal, Smartphone } from "lucide-react"
import {
  SiReact, SiTypescript, SiTailwindcss, SiVuedotjs, SiNodedotjs,
  SiExpress, SiPostgresql, SiMongodb, SiMysql, SiDocker,
  SiAmazon, SiGithubactions, SiGit, SiLinux, SiJavascript,
  SiJest, SiCapacitor, SiApachecordova, SiGoogleplay,
  SiJira, SiConfluence, SiQuasar, SiEslint,
} from "react-icons/si"
import { Category, Technology, CategoryInfo } from "./types"

export const techByCategory: Record<Category, Technology[]> = {
  Frontend: [
    { name: "React", icon: SiReact },
    { name: "Vue.js", icon: SiVuedotjs },
    { name: "Tailwind", icon: SiTailwindcss },
    { name: "Quasar", icon: SiQuasar },
    { name: "TypeScript", icon: SiTypescript },
    { name: "JavaScript", icon: SiJavascript },
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Express", icon: SiExpress },
    { name: "Jest", icon: SiJest },
    { name: "TypeScript", icon: SiTypescript },
    { name: "JavaScript", icon: SiJavascript },
  ],
  Mobile: [
    { name: "React Native", icon: SiReact },
    { name: "Capacitor", icon: SiCapacitor },
    { name: "Cordova", icon: SiApachecordova },
    { name: "PlayStore", icon: SiGoogleplay },
    { name: "Quasar", icon: SiQuasar },
  ],
  Database: [
    { name: "PostgreSQL", icon: SiPostgresql },
    { name: "MySQL", icon: SiMysql },
    { name: "MongoDB", icon: SiMongodb },
  ],
  DevOps: [
    { name: "Docker", icon: SiDocker },
    { name: "AWS", icon: SiAmazon },
    { name: "Git", icon: SiGit },
    { name: "GitHub Actions", icon: SiGithubactions },
  ],
  Tools: [
    { name: "Jira", icon: SiJira },
    { name: "Confluence", icon: SiConfluence },
    { name: "Linux", icon: SiLinux },
    { name: "ESLint", icon: SiEslint },
  ],
}

export const categories: CategoryInfo[] = [
  { name: "Frontend", icon: Layout, code: "FE" },
  { name: "Backend", icon: Server, code: "BE" },
  { name: "Mobile", icon: Smartphone, code: "MB" },
  { name: "Database", icon: Database, code: "DB" },
  { name: "DevOps", icon: Cloud, code: "DO" },
  { name: "Tools", icon: Terminal, code: "TL" },
]
