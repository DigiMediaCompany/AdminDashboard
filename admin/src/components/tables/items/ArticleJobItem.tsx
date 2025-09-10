import { Job } from "../../../types/Article";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge.tsx";
import {useModal} from "../../../hooks/useModal.ts";
import {postApi, updateApi} from "../../../services/adminArticleService.ts";
import JobContextModal from "../../modals/JobContextModal.tsx";
import {useState} from "react";
import {deleteFile, downloadFile, getFile, uploadR2File} from "../../../services/postFunnyService.ts";
import {useGlobalData} from "../../../context/GlobalDataContext.tsx";

interface ArticleJobItemProps {
    jobs: Job[];
    onUpdateJob: (id: number, newJob: Job) => void;
}

function getProgressStatus(progressList: object[]) {
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
            case 2:
                return "Context";
            case 4:
                return "Article";
            case 7:
                return "Summary";
            case 8:
                return "Done-1";
            case 10:
                return "Article"
        }

    }
    if (progressList.every(p => p.status === "Standby")) {
        return "Pending";
    }

    // Default case
    return "Generating";
}

function getYouTubeId(url) {
    try {
        const u = new URL(url);
        return u.searchParams.get("v");
    }
    catch (e) {
        return url
    }

}

export default function ArticleJobItem({ jobs, onUpdateJob }: ArticleJobItemProps) {

    const { isOpen, openModal, closeModal } = useModal();
    const [file, setFile] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { statuses, loading, error, refresh } = useGlobalData();

    return (
        <>
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

                    const statusColorMap: Record<string, BadgeColor> = {
                        Failed: "error",
                        Done: "success",
                        "Done-1": "success",
                        Pending: "light",
                        Context: "info",
                        Article: "info",
                        "Big context": "info",
                        Generating: "warning",
                        "No progress": "dark"
                    };
                    const status = getProgressStatus(job.progress)
                    return(
                    <TableRow key={job.id}>
                        {/* Project Name */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start truncate max-w-[200px]">
                            {getYouTubeId(job.youtube_id) || "—"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start   truncate max-w-[200px]">
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
                                        // title={p.step[0]?.name}
                                    >
                                    </div>
                                }

                                )}
                            </div>
                        </TableCell>


                        <TableCell
                            className="px-3 py-3  text-start text-theme-sm">
                            <div
                                className={(['Done', 'Context', 'Article', 'Big context', 'Summary', 'Done-1'].includes(status ) ) ? "cursor-pointer" : ""}
                                onClick={(['Done', 'Context', 'Article', 'Big context', 'Summary', 'Done-1'].includes(status) ) ? () => {


                                    setSelectedJob(job)
                                    setName(status)
                                    switch (status) {
                                        case "Context":
                                            if (job.context_file !== null) {
                                                setFile(job.context_file)
                                                openModal()
                                            }
                                            break;
                                        case "Article":
                                            if (job.article_file !== null) {
                                                setFile(job.article_file)
                                                openModal()
                                            }
                                            break;
                                        case "Big context":
                                            if (job.series?.big_context_file !== null){
                                                setFile(job.series?.big_context_file)
                                                openModal()
                                            }
                                            break;
                                        case "Done":
                                            if (job.article_file != null) {
                                                downloadFile(job.article_file)
                                            }
                                            break;
                                        default:
                                            console.log("??")
                                    }

                                } : undefined}
                            >
                                <Badge
                                    size="sm"
                                    color={statusColorMap[status] || "default"}
                                >
                                    {status || "—"}
                                </Badge>
                            </div>

                        </TableCell>

                        <TableCell className="px-4 py-3  text-start text-theme-sm ">
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
            <JobContextModal
                file={file}
                text={name}
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(data) => {
                    if (data.fixed && name && selectedJob && file) {
                        const f = new File([data.fixed], "example.txt", {
                            type: "text/plain",
                        });
                        uploadR2File(f)
                            .then((res) => {
                                deleteFile(file).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                const newFile = res.filename
                                switch (name) {
                                    case "Context":
                                        updateApi("jobs", selectedJob.id, {
                                            context_file: newFile
                                        }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});

                                        onUpdateJob(selectedJob.id, {
                                            ...selectedJob,
                                            context_file: newFile,
                                            progress: selectedJob.progress.map((item, index) =>
                                                index === 2 ? { ...item, status: 'Success' } : item
                                            )
                                        })
                                        updateApi("progress", selectedJob.progress[2].id, {
                                            status: 'Success'
                                        }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                        break;
                                    case "Article":
                                        updateApi("jobs", selectedJob.id, {
                                            article_file: newFile
                                        }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                        onUpdateJob(selectedJob.id, {
                                            ...selectedJob,
                                            article_file: newFile,
                                            progress: selectedJob.progress.map((item, index) =>
                                                index === 4 ? { ...item, status: 'Success' } : item
                                            )
                                        })
                                        updateApi("progress", selectedJob.progress[4].id, {
                                            status: 'Success'
                                        }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                        break;
                                    case "Big context":
                                        if (selectedJob.series_id !== null) {
                                            updateApi("series", selectedJob.series_id?.toString(), {
                                                big_context_file: newFile
                                            }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                            onUpdateJob(selectedJob.id, {
                                                ...selectedJob,
                                                series: {
                                                    ...selectedJob.series,
                                                    big_context_file: newFile,
                                                    progress: selectedJob.progress.map((item, index) =>
                                                        index === 6 ? { ...item, status: 'Success' } : item
                                                    )
                                                },
                                            })
                                            updateApi("progress", selectedJob.progress[6].id, {
                                                status: 'Success'
                                            }).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
                                        }

                                        break;
                                    default:
                                        console.log("??")
                                }
                            })
                            .catch((err) => {
                                console.error("Upload failed:", err);
                            });


                    }

                }}
            />
        </>
    );
};

