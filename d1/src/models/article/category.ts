import { ModelSchema } from "../../types";

export const CategoryModel: ModelSchema = {
    id: "number",   // auto-increment primary key
    name: "string", // required, unique
};
