import type { Context } from "hono";
import { getDB } from "../db/client";

export function useDb() {
  return async (c: Context, next: () => Promise<void>) => {
    if (!c.env.D1_DATABASE) {
      console.error("❌ Missing D1 binding in environment");
      return c.text("Internal DB not configured", 500);
    }

    const db = getDB(c.env);
    c.set("db", db);
    await next();
  };
}
