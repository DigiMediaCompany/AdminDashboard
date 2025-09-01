export interface Job {
    id: number;
    raw_youtube_link: string;
    youtube_id: string;
    gpt_conversation_id?: string | null;
    series_id?: number | null;
    episode?: number | null;
    priority: number;
    status_id?: number | null;
    context_file?: string | null;
    article_file?: string | null;
}

export interface Category {
    id: number;
    name: string;
}

export interface Series {
    id: number;
    name: string;
    category_id?: number | null;
    big_context_file?: string | null;
}

export interface Status {
    id: number;
    name: string;
    type: string;
    position: number;
}