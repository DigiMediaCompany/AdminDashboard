import { ModelSchema } from "../../types";

export const ProgressModel: ModelSchema = {
    id: "number",
    status: { type: "string", optional: true },
    status_id: "number",
    job_id: "number",
};
