import { ModelSchema } from "../../types";

export const JobModel: ModelSchema = {
    id: "number",                 // auto-increment
    series_id: { type: "number", optional: true },  // FK
    episode: { type: "number", optional: true },
    priority: { type: "number", optional: true },   // default 0
    detail: "string"
};