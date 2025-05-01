import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["source/index.ts"],
  noExternal: ["@chrono-cache/core", "next"],
  format: ["esm", "cjs"],
  watch: !!process.env.WATCH_MODE,
  dts: true,
});
