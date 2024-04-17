import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["core/server.ts"],
  format: "esm",
  outDir: "dist-core",
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
});
