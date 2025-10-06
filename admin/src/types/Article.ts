export interface Job {
    id: number;
    series_id: number | null;
    series: Series;
    episode: number | null;
    priority: number;
    progress: Progress[];
    detail: string;
    type: number;
}

export interface JobDetail {
    link?: string;
    context_file?: string | null;
    article_file?: string | null;
    summary_files?: string[];
    episode?: string | null;
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

export interface Progress {
    id: number;
    status: string;
    status_id: number;
    job_id: number;
    _parent_id: number;
}