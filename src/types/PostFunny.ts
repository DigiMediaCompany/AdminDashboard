export interface Question {
    img: string;
}

export interface Answer {
    img: string;
}

export interface Quiz {
    id: string;
    title: string;
    img: string;
    description: string;
    createdAt: string;
    createdBy: {
        img: string;
        name: string;
    };
    quizzes: Question[];
    answers: Answer[];
}