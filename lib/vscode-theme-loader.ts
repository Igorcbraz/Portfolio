import type { VSCodeTheme, VSCodeThemeName } from "@/lib/vscode-themes"
import beardedBlueberryData from "@/data/themes/bearded-theme-surprising-blueberry.json"

type ThemeJSON = {
  appearance: "dark" | "light"
  name: string
  colors: Record<string, string>
  tokenColors: Record<string, string>
}

type ThemeModule = { default: ThemeJSON }

const themeImporters: Record<VSCodeThemeName, () => Promise<ThemeModule>> = {
  beardedThemeSurprisingBlueberry: () => import("@/data/themes/bearded-theme-surprising-blueberry.json"),
  darkPlus: () => import("@/data/themes/dark-plus.json"),
  githubDark: () => import("@/data/themes/github-dark.json"),
  dracula: () => import("@/data/themes/dracula.json"),
  monokai: () => import("@/data/themes/monokai.json"),
  oneDarkPro: () => import("@/data/themes/one-dark-pro.json"),
  nord: () => import("@/data/themes/nord.json"),
}

export function isThemeName(value: string): value is VSCodeThemeName {
  return value in themeImporters
}

function createThemeFromJSON(themeData: ThemeJSON): VSCodeTheme {
  return {
    name: themeData.name,
    type: themeData.appearance,
    colors: themeData.colors as VSCodeTheme["colors"],
    tokenColors: themeData.tokenColors as VSCodeTheme["tokenColors"],
  }
}

export const DEFAULT_THEME_NAME: VSCodeThemeName = "beardedThemeSurprisingBlueberry"

export const defaultTheme: VSCodeTheme = createThemeFromJSON(beardedBlueberryData as ThemeJSON)

export async function loadThemeByName(themeName: VSCodeThemeName): Promise<VSCodeTheme> {
  const importer = themeImporters[themeName]
  const module = await importer()
  return createThemeFromJSON(module.default)
}
