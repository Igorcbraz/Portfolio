import repoData from "../data/repo-data.json"

export type FileId = string

type ComponentKey = "portfolio" | "about" | "settings" | "code"

export type FileEntry = {
  id: string
  path: string
  title: string
  description?: string
  component: ComponentKey
  showNavigation?: boolean
  showStatusBar?: boolean
}

export const defaultFile: FileId = "portfolio.tsx"

export const fileRegistry: Record<string, FileEntry> = {}

Object.keys(repoData.mockFiles).forEach((filePath) => {
  let component: ComponentKey = "code"
  let showNavigation = false
  let showStatusBar = true

  if (filePath === "portfolio.tsx") {
    component = "portfolio"
    showNavigation = true
  } else if (filePath === "igor.json") {
    component = "about"
  } else if (filePath === "settings.json") {
    component = "settings"
  }

  fileRegistry[filePath] = {
    id: filePath,
    path: filePath,
    title: filePath.split("/").pop() || filePath,
    component,
    showNavigation,
    showStatusBar,
  }
})

export const fileList: FileEntry[] = Object.values(fileRegistry)

export function resolveFile(fileId?: string): FileEntry | null {
  if (fileId && fileRegistry[fileId]) return fileRegistry[fileId]
  return fileRegistry[defaultFile]
}
