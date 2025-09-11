import {Job, JobDetail, Progress} from "../../../types/Article";
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
import {deleteFile, downloadFile, uploadR2File} from "../../../services/postFunnyService.ts";
import JobSummaryModal from "../../modals/JobSummaryModal.tsx";
import JobSelectSummaryModal from "../../modals/JobSelectSummaryModal.tsx";

interface ArticleJobItemProps {
    jobs: Job[];
    onUpdateJob: (id: number, newJob: Job) => void;
}

function getProgressStatus(job: Job) {
    const progressList: Progress[] = job.progress;
    if (!progressList || progressList.length === 0) return "No progress";

    // 1. If any record is "Failed"
    if (progressList.some(p => p.status === "Failed")) {
        return "Failed";
    }

    // 2. If all records are "Success"
    if (progressList.every(p => p.status === "Success")) {

        if (job.type === 2) {
            return "Select";
        } else {
            return "Done";
        }
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

function getYouTubeId(url: string) {
    try {
        const u = new URL(url);
        return u.searchParams.get("v");
    } catch {
        return url
    }

}

export default function ArticleJobItem({jobs, onUpdateJob}: ArticleJobItemProps) {

    const {isOpen, openModal, closeModal} = useModal();
    const {
        isOpen: isOpen2,
        openModal: openModal2,
        closeModal: closeModal2
    } = useModal();
    const {
        isOpen: isOpen3,
        openModal: openModal3,
        closeModal: closeModal3
    } = useModal();
    const [status, setStatus] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    // const {statuses, loading, error, refresh} = useGlobalData();

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
                        const jobDetail: JobDetail = JSON.parse(job.detail)

                        const statusColorMap: Record<string, BadgeColor> = {
                            Failed: "error",
                            Done: "success",
                            "Select": "success",
                            Pending: "light",
                            Context: "info",
                            Article: "info",
                            "Big context": "info",
                            Generating: "warning",
                            "No progress": "dark",
                            "Summary": "info"
                        };
                        const status = getProgressStatus(job)
                        const jobTypeMap = {
                            1: "Youtube -> Article",
                            2: "Youtube -> Summaries",
                            3: "Summary -> Article"
                        }
                        return (
                            <TableRow key={job.id}>
                                {/* Project Name */}
                                <TableCell className="px-5 py-4 sm:px-6 text-start truncate max-w-[200px]">
                                    {jobDetail.link ? getYouTubeId(jobDetail.link) || "—" : "—"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start   truncate max-w-[200px]">
                                    {job.series?.name || "—"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start   truncate max-w-[200px]">
                                    {jobTypeMap[job.type] || "—"}
                                </TableCell>


                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                                        className={(['Done', 'Context', 'Article', 'Big context', 'Summary', 'Select'].includes(status)) ? "cursor-pointer" : ""}
                                        onClick={(['Done', 'Context', 'Article', 'Big context', 'Summary', 'Select'].includes(status)) ? () => {


                                            setSelectedJob(job)
                                            setStatus(status)

                                            switch (status) {
                                                case "Context":
                                                    if (jobDetail.context_file) {
                                                        openModal()
                                                    }
                                                    break;
                                                case "Article":
                                                    if (jobDetail.article_file) {
                                                        openModal()
                                                    }
                                                    break;
                                                // case "Big context":
                                                //     if (job.series?.big_context_file !== null){
                                                //         setFile(job.series?.big_context_file)
                                                //         openModal()
                                                //     }
                                                //     break;
                                                case "Done":
                                                    if (jobDetail.article_file) {
                                                        downloadFile(jobDetail.article_file).then(r => console.log(r))
                                                    }
                                                    break;
                                                case "Select":
                                                    openModal3();
                                                    break;
                                                case "Summary":
                                                    openModal2();
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
                data={selectedJob}
                text={status}
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(data) => {
                    if (data.fixed && status && selectedJob) {
                        const f = new File([data.fixed], "example.txt", {
                            type: "text/plain",
                        });
                        const detail = JSON.parse(selectedJob.detail);
                        let workingProgressPosition: number = 0;

                        uploadR2File(f)
                            .then((res) => {

                                const newFile = res.filename
                                switch (status) {
                                    case "Context":
                                        deleteFile(detail.context_file).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });
                                        updateApi("jobs", selectedJob.id, {
                                            detail: JSON.stringify( {
                                                ...detail,
                                                context_file: newFile,
                                            })
                                        }).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });

                                        onUpdateJob(selectedJob.id, {
                                            ...selectedJob,
                                            detail: JSON.stringify( {
                                                ...detail,
                                                context_file: newFile,
                                            }),
                                            progress: selectedJob.progress.map((item, index) =>
                                                index === 1 ? {...item, status: 'Success'} : item
                                            )
                                        })
                                        updateApi("progress", selectedJob.progress[1].id, {
                                            status: 'Success'
                                        }).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });
                                        break;
                                    case "Article":
                                        deleteFile(detail.article_file).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });

                                        updateApi("jobs", selectedJob.id, {
                                            detail: JSON.stringify( {
                                                ...detail,
                                                article_file: newFile,
                                            })
                                        }).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });
                                        if (selectedJob.type === 1) {
                                            workingProgressPosition = 3
                                        } else {
                                            workingProgressPosition = 1
                                        }
                                        onUpdateJob(selectedJob.id, {
                                            ...selectedJob,
                                            detail: JSON.stringify( {
                                                ...detail,
                                                article_file: newFile,
                                            }),
                                            progress: selectedJob.progress.map((item, index) =>
                                                index === workingProgressPosition ? {...item, status: 'Success'} : item
                                            )
                                        })
                                        updateApi("progress", selectedJob.progress[workingProgressPosition].id, {
                                            status: 'Success'
                                        }).then(() => {
                                            console.log("yay")
                                        }).catch(() => {
                                            console.log("error")
                                        });
                                        break;
                                    // case "Big context":
                                    //     if (selectedJob.series_id !== null) {
                                    //         updateApi("series", selectedJob.series_id?.toString(), {
                                    //             big_context_file: newFile
                                    //         }).then(() => {
                                    //             console.log("yay")
                                    //         }).catch(() => {
                                    //             console.log("error")
                                    //         });
                                    //         onUpdateJob(selectedJob.id, {
                                    //             ...selectedJob,
                                    //             series: {
                                    //                 ...selectedJob.series,
                                    //                 big_context_file: newFile,
                                    //                 progress: selectedJob.progress.map((item, index) =>
                                    //                     index === 6 ? {...item, status: 'Success'} : item
                                    //                 )
                                    //             },
                                    //         })
                                    //         updateApi("progress", selectedJob.progress[6].id, {
                                    //             status: 'Success'
                                    //         }).then(() => {
                                    //             console.log("yay")
                                    //         }).catch(() => {
                                    //             console.log("error")
                                    //         });
                                    //     }

                                        // break;
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
            <JobSummaryModal
                text={status}
                data={selectedJob}
                isOpen={isOpen2}
                onClose={closeModal2}
                onSave={(data) => {
                    if (status && status === "Summary" && selectedJob) {
                        let currentDetail = {};
                        try {
                            currentDetail = selectedJob.detail
                                ? JSON.parse(selectedJob.detail as string)
                                : {};
                        } catch {
                            currentDetail = {};
                        }
                        const newDetail = {
                            ...currentDetail,
                            summaries: data.summaries,
                        };
                        const detailString = JSON.stringify(newDetail);
                        updateApi("jobs", selectedJob.id,{
                            detail: detailString
                        }).then(() => {
                            console.log("yay")
                        }).catch(() => {
                            console.log("error")
                        });
                        onUpdateJob(selectedJob.id, {
                            ...selectedJob,
                            progress: selectedJob.progress.map((item, index) =>
                                index === 1 ? {...item, status: 'Success'} : item
                            ),
                            detail: detailString
                        })
                        updateApi("progress", selectedJob.progress[1].id, {
                            status: 'Success'
                        }).then(() => {
                            console.log("yay")
                        }).catch(() => {
                            console.log("error")
                        });
                    }
                }}
            />
            <JobSelectSummaryModal
                text={status}
                data={selectedJob}
                isOpen={isOpen3}
                onClose={closeModal3}
                onSave={(data) => {
                    if (selectedJob) {
                        const detail = JSON.parse(selectedJob.detail)
                        postApi('jobs', {
                            detail: JSON.stringify({
                                link: detail.link,
                                summary: data.selectedSummary
                            }),
                            type: 3
                        }).then(() => {
                            window.location.reload();
                        }).catch(() => {
                        })
                    }
                }}
                />

        </>
    );
};

