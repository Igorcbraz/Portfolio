import { spawn, type ChildProcess } from "node:child_process"
import { setTimeout as delay } from "node:timers/promises"

export type DevServerInstance = {
  process: ChildProcess
  output: () => string
  stop: () => Promise<void>
}

type StartDevServerOptions = {
  cwd: string
  command: string[]
  targetUrl: string
  readyTimeoutMs: number
}

async function waitForServerReady(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" })
      if (response.ok || response.status === 404) {
        return
      }
    } catch {
      // Ignore temporary connection errors while booting.
    }

    await delay(1_000)
  }

  throw new Error(`Timeout waiting for server at ${url}`)
}

async function stopProcessTree(child: ChildProcess): Promise<void> {
  if (!child.pid) return

  if (process.platform === "win32") {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        shell: true,
        stdio: "ignore",
      })

      killer.on("exit", () => resolve())
      killer.on("error", () => {
        child.kill("SIGTERM")
        resolve()
      })
    })
    return
  }

  child.kill("SIGTERM")
}

export async function startDevServer(options: StartDevServerOptions): Promise<DevServerInstance> {
  const [bin, ...args] = options.command

  const child = spawn(bin, args, {
    cwd: options.cwd,
    env: process.env,
    shell: process.platform === "win32",
  })

  let logs = ""

  child.stdout?.on("data", (chunk: Buffer) => {
    logs += chunk.toString()
  })

  child.stderr?.on("data", (chunk: Buffer) => {
    logs += chunk.toString()
  })

  const earlyExit = new Promise<never>((_, reject) => {
    child.once("exit", (code) => {
      reject(new Error(`Server exited before readiness check with code ${String(code)}`))
    })
    child.once("error", (error) => {
      reject(new Error(`Failed to start server: ${error.message}`))
    })
  })

  await Promise.race([waitForServerReady(options.targetUrl, options.readyTimeoutMs), earlyExit])

  return {
    process: child,
    output: () => logs,
    stop: async () => {
      await stopProcessTree(child)
    },
  }
}
