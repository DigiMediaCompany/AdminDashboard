import { drizzle } from "drizzle-orm/d1";
import * as games from "./games";
import type { DrizzleD1Database } from "drizzle-orm/d1";
let _db: DrizzleD1Database | null = null;

export function getDB(env: any): DrizzleD1Database {
  if (!_db) {
    _db = drizzle(env.D1_DATABASE);
  }
  return _db;
}
