import beardedBlueberryData from "@/data/themes/bearded-theme-surprising-blueberry.json"
import darkPlusData from "@/data/themes/dark-plus.json"
import githubDarkData from "@/data/themes/github-dark.json"
import draculaData from "@/data/themes/dracula.json"
import monokaiData from "@/data/themes/monokai.json"
import oneDarkProData from "@/data/themes/one-dark-pro.json"
import nordData from "@/data/themes/nord.json"

export interface VSCodeTheme {
  name: string
  type: "dark" | "light"
  colors: {
    // Editor colors
    "editor.background": string
    "editor.foreground": string
    "editorLineNumber.foreground": string
    "editorLineNumber.activeForeground": string

    // Activity Bar
    "activityBar.background": string
    "activityBar.foreground": string
    "activityBar.activeBorder": string
    "activityBar.inactiveForeground": string

    // Status Bar
    "statusBar.background": string
    "statusBar.foreground": string
    "statusBar.border": string
    "statusBar.debuggingBackground": string
    "statusBar.noFolderBackground": string

    // Title Bar
    "titleBar.activeBackground": string
    "titleBar.activeForeground": string
    "titleBar.inactiveBackground": string
    "titleBar.inactiveForeground": string
    "titleBar.border": string

    // Sidebar
    "sideBar.background": string
    "sideBar.foreground": string
    "sideBar.border": string

    // Tab colors
    "tab.activeBackground": string
    "tab.activeForeground": string
    "tab.inactiveBackground": string
    "tab.inactiveForeground": string
    "tab.border": string
    "tab.activeBorder": string
    "tab.activeBorderTop": string

    // Editor Group
    "editorGroup.border": string
    "editorGroupHeader.tabsBackground": string
    "editorGroupHeader.tabsBorder": string

    // Input
    "input.background": string
    "input.foreground": string
    "input.border": string
    "input.placeholderForeground": string

    // Button
    "button.background": string
    "button.foreground": string
    "button.hoverBackground": string

    // Dropdown
    "dropdown.background": string
    "dropdown.foreground": string
    "dropdown.border": string

    // List
    "list.activeSelectionBackground": string
    "list.activeSelectionForeground": string
    "list.inactiveSelectionBackground": string
    "list.hoverBackground": string
    "list.hoverForeground": string

    // Badge
    "badge.background": string
    "badge.foreground": string

    // Panel
    "panel.background": string
    "panel.border": string
    "panelTitle.activeBorder": string
    "panelTitle.activeForeground": string
    "panelTitle.inactiveForeground": string

    // Terminal
    "terminal.background": string
    "terminal.foreground": string
    "terminal.ansiBlack": string
    "terminal.ansiRed": string
    "terminal.ansiGreen": string
    "terminal.ansiYellow": string
    "terminal.ansiBlue": string
    "terminal.ansiMagenta": string
    "terminal.ansiCyan": string
    "terminal.ansiWhite": string
  }
  tokenColors: {
    comment: string
    string: string
    number: string
    keyword: string
    variable: string
    function: string
    class: string
    type: string
    property: string
    constant: string
  }
}

function createThemeFromJSON(themeData: {
  appearance: string
  name: string
  colors: Record<string, string>
  tokenColors: Record<string, string>
}): VSCodeTheme {
  return {
    name: themeData.name,
    type: themeData.appearance as "dark" | "light",
    colors: themeData.colors as VSCodeTheme["colors"],
    tokenColors: themeData.tokenColors as VSCodeTheme["tokenColors"]
  }
}

function createThemeKey(filename: string): string {
  return filename
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/\.json$/, "")
}

const themeFiles = {
  "bearded-theme-surprising-blueberry": beardedBlueberryData,
  "dark-plus": darkPlusData,
  "github-dark": githubDarkData,
  "dracula": draculaData,
  "monokai": monokaiData,
  "one-dark-pro": oneDarkProData,
  "nord": nordData,
}

export const vscodeThemes = Object.entries(themeFiles).reduce((acc, [filename, data]) => {
  const key = createThemeKey(filename)
  acc[key] = createThemeFromJSON(data)
  return acc
}, {} as Record<string, VSCodeTheme>)

export type VSCodeThemeName = keyof typeof vscodeThemes

export const DEFAULT_THEME: VSCodeThemeName = "beardedThemeSurprisingBlueberry"
