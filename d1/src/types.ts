import { D1Database } from '@cloudflare/workers-types';

export interface Env {
	D1_DATABASE: D1Database;
	API_TOKEN: string;
}

export type FieldSchema =
	| "string"
	| "number"
	| "boolean"
	| { type: "string" | "number" | "boolean"; optional?: boolean };

export type ModelSchema = Record<string, FieldSchema>;