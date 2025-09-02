import { Job } from "../../../types/Article";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge.tsx";

interface ArticleJobItemProps {
    jobs: Job[];
}

function getProgressStatus(progressList) {
    if (!progressList || progressList.length === 0) return "No progress";

    // 1. If any record is "Failed"
    if (progressList.some(p => p.status === "Failed")) {
        return "Failed";
    }

    // 2. If all records are "Success"
    if (progressList.every(p => p.status === "Success")) {
        return "Done";
    }

    // 3. Get highest id record with "Going"
    const goingRecords = progressList.filter(p => p.status === "Going");
    if (goingRecords.length > 0) {
        const highestGoing = goingRecords.reduce((prev, curr) =>
            curr.id > prev.id ? curr : prev
        );

        switch (highestGoing.status_id) {
            case 3:
                return "Review context";
            case 5:
                return "Review article";
            case 7:
                return "Review big context";
        }

    }
    if (progressList.every(p => p.status === "Standby")) {
        return "Pending";
    }

    // Default case
    return "Generating";
}

export default function ArticleJobItem({ jobs }: ArticleJobItemProps) {

    return (
        <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 "
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
                        Status
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
                {jobs.map((job) => {

                    const status = getProgressStatus(job.progress)
                    return(
                    <TableRow key={job.id}>
                        {/* Project Name */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start truncate max-w-[250px]">
                            {job.youtube_id || "—"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start   truncate max-w-[250px]">
                            {job.series?.name || "—"}
                        </TableCell>


                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex space-x-2">
                                {job.progress?.map((p, index) => {
                                    let bgColor;

                                    switch (p.status) {
                                        case "Going":
                                            bgColor = "bg-yellow-500";
                                            break;
                                        case "Success":
                                            bgColor = "bg-green-500";
                                            break;
                                        case "Failed":
                                            bgColor = "bg-red-500";
                                            break;
                                        case "Standby":
                                            bgColor = "bg-gray-500";
                                            break;
                                        default:
                                            bgColor = "bg-gray-500";
                                    }
                                    return <div
                                        key={index}
                                        className={`w-6 h-6 rounded-full ${bgColor}`}
                                        title={p.step[0]?.name}
                                    >
                                    </div>
                                }

                                )}
                            </div>
                        </TableCell>


                        <TableCell
                            className={(['Done', 'Review context', 'Review article', 'Review big context'].includes(status ) ) ? "cursor-pointer" : ""}
                            onClick={(['Done', 'Review context', 'Review article', 'Review big context'].includes(status) ) ? () => {
                                console.log(status )
                            } : undefined}
                        >
                            <Badge
                                size="sm"
                                color={{
                                    "Failed": "error",
                                    "Done": "success",
                                    "Pending": "light",
                                    "Review context": "info",
                                    "Review article": "info",
                                    "Review big context": "info",
                                    "Generating": "warning"
                                }[status] || "default"}
                            >
                                {status || "—"}
                            </Badge>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Badge
                                size="sm"
                                color={
                                    job.priority === 0
                                        ? "light"
                                        : job.priority === 1
                                            ? "warning"
                                            : "error"
                                }
                            >
                                {
                                    job.priority === 0
                                        ? "Low"
                                        : job.priority === 1
                                            ? "High"
                                            : "Urgent"
                                }
                            </Badge>
                        </TableCell>


                    </TableRow>)
                })}
            </TableBody>
        </Table>
    );
};

