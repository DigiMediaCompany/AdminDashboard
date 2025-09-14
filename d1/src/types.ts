import { D1Database } from '@cloudflare/workers-types';

// export interface Env {
// 	D1_DATABASE: D1Database;
// 	API_TOKEN: string;
// }
//
// export type FieldSchema =
// 	| "string"
// 	| "number"
// 	| "boolean"
// 	| { type: "string" | "number" | "boolean"; optional?: boolean };
//
// // TODO: change this to drizzle maybe?
// export type ModelSchema = Record<string, FieldSchema>;

export type Env = {
	Bindings: {
		D1_DATABASE: D1Database;
	};
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

