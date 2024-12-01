import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import materialSymbols from "vite-plugin-material-symbols";

const port = parseInt(
  new URL(process.env.APP_URL || "http://localhost:8080").port,
  10,
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), materialSymbols()],
  server: { open: true, port },
  preview: { open: true, port },
  build: { outDir: "dist-app" },
  define: { coreUrl: `'${process.env.CORE_URL || "http://localhost:8090"}'` },
});
