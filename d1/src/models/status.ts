import { ModelSchema } from "../types";

export const StatusModel: ModelSchema = {
    id: "number",       // auto-increment primary key
    name: "string",     // required text
    type: "string",     // required text
    position: "number", // required integer
};
