import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import {useEffect, useState} from "react";
import { getJobs } from "../../services/adminArticleService.ts";
import {Job} from "../../types/Article.ts";


export default function ArticleTable() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    // const currentPage = parseInt(searchParams.get("page") || "1")
    const [totalPages, setTotalPages] = useState(1)
    useEffect(() => {
        setLoading(true)
        getJobs(1)
            .then(result => {
                setJobs(result.data);
                setTotalPages(result.total_pages)
            })
            .catch(() => {
                // setToast({
                //     show: true,
                //     variant: "error",
                //     title: "Error",
                //     message: 'Failed to load quizzes.'
                // });
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                User
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Project Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Team
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Status
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Budget
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {jobs.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 overflow-hidden rounded-full">
                                            <img
                                                width={40}
                                                height={40}
                                                src=""
                                                alt=""
                                            />
                                        </div>
                                        <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.youtube_id}
                      </span>
                                        </div>
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
