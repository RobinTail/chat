import { writeFile } from "node:fs/promises";
import { Integration } from "zod-sockets";
import { socketConfig } from "./config";

await writeFile(
  "src/client.ts",
  new Integration({ config: socketConfig, actions: [] }).print(),
  "utf-8",
);
