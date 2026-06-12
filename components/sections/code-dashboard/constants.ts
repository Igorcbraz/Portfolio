export const CODE_SNIPPETS = [
  "const repos = await github.fetch()",
  "git commit -m 'feat: new feature'",
  "npm run build --production",
  "export default function Portfolio()",
  "useState<GitHubRepo[]>([])",
  "import { motion } from 'framer-motion'",
  "type Props = { stars: number }",
  "await Promise.all(repos.map(...))",
];

export const LANG_BG_CLASSES: Record<string, string> = {
  TypeScript: "bg-[oklch(0.65_0.18_250)]",
  JavaScript: "bg-[oklch(0.85_0.18_90)]",
  Python: "bg-[oklch(0.72_0.16_240)]",
  Go: "bg-[oklch(0.68_0.20_200)]",
  Rust: "bg-[oklch(0.62_0.20_40)]",
  Java: "bg-[oklch(0.65_0.16_30)]",
  "C#": "bg-[oklch(0.60_0.22_300)]",
  CSS: "bg-[oklch(0.70_0.18_250)]",
  HTML: "bg-[oklch(0.68_0.20_35)]",
  Shell: "bg-[oklch(0.70_0.12_140)]",
  Vue: "bg-[oklch(0.65_0.20_165)]",
};
export const getLangBgClass = (lang: string) =>
  LANG_BG_CLASSES[lang] ?? "bg-[oklch(0.62_0.22_41.1)]";

const LANG_SHADOW_CLASSES: Record<string, string> = {
  TypeScript: "shadow-[0_0_6px_2px_oklch(0.65_0.18_250/0.4)]",
  JavaScript: "shadow-[0_0_6px_2px_oklch(0.85_0.18_90/0.4)]",
  Python: "shadow-[0_0_6px_2px_oklch(0.72_0.16_240/0.4)]",
  Go: "shadow-[0_0_6px_2px_oklch(0.68_0.20_200/0.4)]",
  Rust: "shadow-[0_0_6px_2px_oklch(0.62_0.20_40/0.4)]",
  Java: "shadow-[0_0_6px_2px_oklch(0.65_0.16_30/0.4)]",
  "C#": "shadow-[0_0_6px_2px_oklch(0.60_0.22_300/0.4)]",
  CSS: "shadow-[0_0_6px_2px_oklch(0.70_0.18_250/0.4)]",
  HTML: "shadow-[0_0_6px_2px_oklch(0.68_0.20_35/0.4)]",
  Shell: "shadow-[0_0_6px_2px_oklch(0.70_0.12_140/0.4)]",
  Vue: "shadow-[0_0_6px_2px_oklch(0.65_0.20_165/0.4)]",
};
export const getLangShadowClass = (lang: string) =>
  LANG_SHADOW_CLASSES[lang] ?? "shadow-[0_0_6px_2px_oklch(0.62_0.22_41.1/0.4)]";