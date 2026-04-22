import fs from "node:fs/promises"
import path from "node:path"

export type AppliedChange = {
  filePath: string
  before: string
  after: string
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8")
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, "utf8")
}

export async function applyTextTransform(
  filePath: string,
  transformer: (content: string) => string,
): Promise<AppliedChange | null> {
  if (!(await fileExists(filePath))) return null

  const before = await readTextFile(filePath)
  const after = transformer(before)

  if (before === after) return null

  await writeTextFile(filePath, after)

  return {
    filePath,
    before,
    after,
  }
}

export async function restoreChanges(changes: AppliedChange[]): Promise<void> {
  for (let index = changes.length - 1; index >= 0; index -= 1) {
    const change = changes[index]
    await writeTextFile(change.filePath, change.before)
  }
}

export async function listSourceFiles(
  rootDir: string,
  extensions: string[] = [".ts", ".tsx", ".js", ".jsx"],
  excludeDirs: string[] = [".git", "node_modules", ".next", "seo-agent"],
): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const absolute = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) continue
        await walk(absolute)
        continue
      }

      const extension = path.extname(entry.name)
      if (extensions.includes(extension)) {
        files.push(absolute)
      }
    }
  }

  await walk(rootDir)
  return files
}
