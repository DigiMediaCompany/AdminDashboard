import { constants } from "../utils/constants";

export interface Pagination<T> {
    data: T[];
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
}

export interface Info {
    name_uppercase?: string;
    name_lowercase?: string;
    website_url?: string;
    website_full_url?: string;
    email?: string;
    author?: string;
}

export type Site = (typeof constants.SITES)[keyof typeof constants.SITES];

export interface Ads {
    id: number;
    site: string;
    slot: number;
    description: string;
    script: string;
}

export type SiteProps = {
    site: Site;
};