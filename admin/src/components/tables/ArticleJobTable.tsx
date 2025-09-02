import {useEffect, useState} from "react";
import { getApi } from "../../services/adminArticleService.ts";
import {Job} from "../../types/Article.ts";
import ArticleJobItem from "./items/ArticleJobItem.tsx";
import Toast from "../../pages/UiElements/Toast.tsx";
import {QuizPagination} from "../ui/pagination/QuizPagination.tsx";
import {useSearchParams} from "react-router";


export default function ArticleJobTable() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const currentPage = parseInt(searchParams.get("page") || "1")
    const [totalPages, setTotalPages] = useState(1)
    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() })
    }
    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error";
        title: string;
        message: string;
    }>({
        show: false,
        variant: "success",
        title: "",
        message: ""
    });
    useEffect(() => {
        setLoading(true)
        getApi<Job>('jobs', 1)
            .then(result => {
                setJobs(result.data);
                setTotalPages(result.total_pages)
            })
            .catch(() => {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: 'Failed to load quizzes.'
                });
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Loading quizzes...</p>
    return (
        <>
            {toast.show && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    changeState={() => setToast({ show: false,
                        variant: "success",
                        title: "",
                        message: ""
                    })}
                />
            )}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <ArticleJobItem jobs={jobs} />
                </div>
            </div>
            <div className="mt-6">
                <QuizPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}
