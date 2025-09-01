import { ModelSchema } from "../../types";

export const SeriesModel: ModelSchema = {
    id: "number",                 // auto-increment
    name: "string",               // required
    category_id: { type: "number", optional: true }, // FK, optional
    big_context_file: { type: "string", optional: true }, // optional
};
