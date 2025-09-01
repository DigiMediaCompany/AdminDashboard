import { Env } from "./types";

export function getDb(env: Env) {
    return env.D1_DATABASE;
}
