import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const port = parseInt(
  new URL(process.env.APP_URL || "http://localhost:8080").port,
  10,
);

const icons = ["volume_up", "volume_off", "logout", "send", "close"].toSorted();

process.env.VITE_ICONS = icons.join(",");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { open: true, port },
  preview: { open: true, port },
  build: { outDir: "dist-app" },
  define: { coreUrl: `'${process.env.CORE_URL || "http://localhost:8090"}'` },
});
