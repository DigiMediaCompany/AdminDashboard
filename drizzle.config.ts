import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./d1/src/db/news.ts",
  out: "./d1/migrations",
  dialect: "sqlite",
  driver: "d1-http",
});
