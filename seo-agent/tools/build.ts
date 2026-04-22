import { spawn } from "node:child_process"

export type CommandExecution = {
  ok: boolean
  code: number | null
  stdout: string
  stderr: string
  combinedOutput: string
  durationMs: number
}

export async function runCommand(cwd: string, command: string[], label: string): Promise<CommandExecution> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const [bin, ...args] = command

    const child = spawn(bin, args, {
      cwd,
      env: process.env,
      shell: process.platform === "win32",
    })

    let stdout = ""
    let stderr = ""

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString()
    })

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString()
    })

    child.on("error", (error) => {
      reject(new Error(`[${label}] Failed to execute command: ${error.message}`))
    })

    child.on("close", (code) => {
      const durationMs = Date.now() - startTime
      const combinedOutput = `${stdout}\n${stderr}`.trim()

      resolve({
        ok: code === 0,
        code,
        stdout,
        stderr,
        combinedOutput,
        durationMs,
      })
    })
  })
}

export function runBuild(cwd: string, command: string[] = ["npm", "run", "build"]) {
  return runCommand(cwd, command, "build")
}
