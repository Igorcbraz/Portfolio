#!/usr/bin/env node

require("esbuild-register/dist/node").register({
  format: "cjs",
  target: "es2020",
  extensions: [".ts", ".tsx"],
})

require("./index.ts")
