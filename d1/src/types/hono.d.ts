import type { DBType } from "../db/client";

declare module "hono" {
  interface ContextVariableMap {
    db: DBType;
  }
}
