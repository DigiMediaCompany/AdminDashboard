import { D1Database } from '@cloudflare/workers-types';

export type Env = {
	D1_DATABASE: D1Database;
	API_TOKEN: string;
};

export type FieldSchema = {
	type: "string" | "number" | "boolean" | "date";
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	enum?: string[];
};

export type ModelSchema = {
	table: string;
	fields: Record<string, FieldSchema>;
};

