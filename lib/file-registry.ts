export type FileId = "portfolio.tsx" | "igor.json" | "settings.json"

type ComponentKey = "portfolio" | "about" | "settings"

export type FileEntry = {
  id: FileId
  path: string
  title: string
  description?: string
  component: ComponentKey
  showNavigation?: boolean
  showStatusBar?: boolean
}

export const defaultFile: FileId = "portfolio.tsx"

export const fileRegistry: Record<FileId, FileEntry> = {
  "portfolio.tsx": {
    id: "portfolio.tsx",
    path: "portfolio.tsx",
    title: "Portfolio",
    component: "portfolio",
    showNavigation: true,
    showStatusBar: true,
  },
  "igor.json": {
    id: "igor.json",
    path: "igor.json",
    title: "Igor Profile",
    component: "about",
    showNavigation: false,
    showStatusBar: true,
  },
  "settings.json": {
    id: "settings.json",
    path: "settings.json",
    title: "Settings",
    component: "settings",
    showNavigation: false,
    showStatusBar: true,
  },
}

export const fileList: FileEntry[] = Object.values(fileRegistry)

export function resolveFile(fileId?: string): FileEntry | null {
  if (fileId && fileRegistry[fileId as FileId]) return fileRegistry[fileId as FileId]
  return fileRegistry[defaultFile]
}
