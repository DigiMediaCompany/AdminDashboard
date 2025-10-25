import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Toast from "../../pages/UiElements/Toast.tsx";
import { QuizPagination } from "../ui/pagination/QuizPagination.tsx";

type ToastState = {
    show: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
};

type BaseTableProps<T> = {
    fetchData: (page: number) => Promise<{
        data: T[];
        total_pages: number;
    }>;
    renderRows: (data: T[]) => React.ReactNode;
    loadingText?: string;
    errorMessage?: string;
};

export default function BaseTable<T>({
                                         fetchData,
                                         renderRows,
                                         loadingText = "Loading data...",
                                         errorMessage = "Failed to load data."
                                     }: BaseTableProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        variant: "success",
        title: "",
        message: ""
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    useEffect(() => {
        setLoading(true);
        fetchData(currentPage)
            .then((result) => {
                setItems(result.data);
                setTotalPages(result.total_pages);
            })
            .catch(() => {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: errorMessage
                });
            })
            .finally(() => setLoading(false));
    }, [currentPage]);

    if (loading) {
        return (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                {loadingText}
            </p>
        );
    }

    return (
        <>
            {toast.show && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    changeState={() =>
                        setToast({
                            show: false,
                            variant: "success",
                            title: "",
                            message: ""
                        })
                    }
                />
            )}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">{renderRows(items)}</div>
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
