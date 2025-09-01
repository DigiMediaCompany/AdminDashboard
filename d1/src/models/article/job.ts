import { ModelSchema } from "../../types";

export const JobModel: ModelSchema = {
    id: "number",                 // auto-increment
    raw_youtube_link: "string",   // required
    youtube_id: "string",         // required
    gpt_conversation_id: { type: "string", optional: true },
    series_id: { type: "number", optional: true },  // FK
    episode: { type: "number", optional: true },
    priority: { type: "number", optional: true },   // default 0
    status_id: { type: "number", optional: true },  // FK
    context_file: { type: "string", optional: true },
    article_file: { type: "string", optional: true },
};