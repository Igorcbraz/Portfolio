declare module "lighthouse" {
  type LighthouseOptions = {
    port?: number
    output?: string
    logLevel?: string
    onlyCategories?: string[]
  }

  type LighthouseRunnerResult = {
    lhr?: any
    report?: string | object
  }

  function lighthouse(url: string, options?: LighthouseOptions, config?: any): Promise<LighthouseRunnerResult | undefined>

  export default lighthouse
}

declare module "chrome-launcher" {
  type ChromeHandle = {
    port: number
    kill: () => Promise<void>
  }

  type ChromeLaunchOptions = {
    chromeFlags?: string[]
    chromePath?: string
  }

  export function launch(options?: ChromeLaunchOptions): Promise<ChromeHandle>
}
