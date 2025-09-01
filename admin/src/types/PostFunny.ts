export interface Choice {
    choice: string;
    score: number;
    img: string;
}

export interface Question {
    img: string;
    question: string;
    answers: Choice[];
}

export interface Answer {
    img: string;
    id: number;
    title: string;
    description: string;
}

export interface Quiz {
    id: string;
    title: string;
    img: string;
    description: string;
    createdAt: string;
    createdBy: string;
    quizzes: Question[];
    answers: Answer[];
}

export interface FileUploadResponse {
    filename: string;
}