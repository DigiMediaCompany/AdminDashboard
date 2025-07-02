import { Quiz } from "./PostFunny";

export interface Pagination {
    data: Quiz[];
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
}