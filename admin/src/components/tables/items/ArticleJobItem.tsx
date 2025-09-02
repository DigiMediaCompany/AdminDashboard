import { Job } from "../../../types/Article";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface ArticleJobItemProps {
    jobs: Job[];
}

export default function ArticleJobItem({ jobs }: ArticleJobItemProps) {
    return (
        <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Youtube ID
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Series - Episode
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Progress
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Priority
                    </TableCell>
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {jobs.map((job) => (
                    <TableRow key={job.id}>
                        {/* Project Name */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {job.youtube_id || "—"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {job.series?.name || "—"}
                        </TableCell>


                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

