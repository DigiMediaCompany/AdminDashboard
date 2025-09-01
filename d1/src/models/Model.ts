export type FieldSchema =
    | "string"
    | "number"
    | "boolean"
    | { type: "string" | "number" | "boolean"; optional?: boolean };

export type ModelSchema = Record<string, FieldSchema>;