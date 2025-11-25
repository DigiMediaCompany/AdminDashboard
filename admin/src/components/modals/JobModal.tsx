import {useEffect, useMemo, useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import {getApi} from "../../services/adminArticleService.ts";
import {Job, Series} from "../../types/Article.ts";
import Select from "../form/Select.tsx";
import {isValidYouTubeUrl} from "../../utils/helper.ts";
import {constants} from "../../utils/constants.ts";
import {useAppSelector} from "../../store";

interface JobData {
    type: string;
    series: string;
    // Job type 1
    link?: string;
    // Job type 2,
    link2?: string;
    episode?: string;
    // Job type 3,
    link3?: string;
    episode2?: string;
    summary?: string;
    title?: string;
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: JobData) => void;
}

export default function JobModal({
                                     isOpen,
                                     onClose,
                                     onSave,
                                 }: BaseModalProps) {
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [mapping, setMapping] = useState<Record<string, never[]>>({});

    const [jobData, setJobData] = useState<JobData>({
        series: "",
        link: "",
        link2: "",
        link3: "",
        type: "",
        episode: "",
        episode2: "",
        summary: "",
        title: "",
    });

    const episodeOptions = useMemo(
        () => Object.keys(mapping).map(ep => ({ value: ep, label: ep })),
        [mapping]
    );

    const summaryOptions = useMemo(
        () =>
            jobData.episode2
                ? mapping[jobData.episode2]?.map(sum => ({ value: sum.title, label: sum.title }))
                : [],
        [mapping, jobData.episode2]
    );

    const handleSave = () => {
        if (!jobData.type) return;
        onSave(jobData);
        onClose();
    };


    useEffect(() => {
        getApi<Series>('series')
            .then(result => {
                setSeriesList(result.data);
            })
            .catch(() => {
            })
    }, [])

    const authState = useAppSelector((state) => state.auth)
    const userRole = authState.user?.user_metadata?.role

    useEffect(() => {
        if (!jobData.series) return;

        getApi<Job>('jobs', 1, 'progress', '-id', {
            series_id: jobData.series,
            type: 2
        })
            .then(result => {
                const filtered = result.data
                    .filter((job) => {
                        const second = job.progress?.[1];
                        return second && second.status === "Success";
                    })
                    .reduce((acc: Record<string, { title: string; text: string; link: string }[]>, job) => {
                        let detail: any = {};
                        try {
                            detail = JSON.parse(job.detail);
                        } catch {
                            detail = {};
                        }

                        const episode = job.episode ?? detail.episode ?? `job-${job.id}`;
                        const summaries = detail.summaries
                            ? detail.summaries.map((s: any) => ({
                                title: s.title,
                                text: s.text,
                                link: detail.link ?? "",
                            }))
                            : [];

                        acc[episode] = (acc[episode] || []).concat(summaries);
                        return acc;
                    }, {});

                setMapping(filtered);
            })
            .catch(() => {
                console.log("nay");
            });
    }, [jobData.series]);


    const isFormValid = (() => {

        if (!jobData.type) return false;
        // if (!jobData.series) return false;

        if (jobData.type === constants.JOB_TYPES[0].value || jobData.type === constants.JOB_TYPES[3].value) {
            const link = jobData.link?.trim()
            return (
                link &&
                link !== "" &&
                isValidYouTubeUrl(link)
            );
        }

        if (jobData.type === constants.JOB_TYPES[1].value) {
            const link = jobData.link2?.trim()
            return (
                link &&
                link !== "" &&
                isValidYouTubeUrl(link) &&
                jobData.series &&
                jobData.episode

            );
        }

        if (jobData.type === constants.JOB_TYPES[2].value) {
            const link = jobData.link3?.trim()
            return (
                link &&
                link !== "" &&
                isValidYouTubeUrl(link) &&
                jobData.series &&
                jobData.episode2 &&
                jobData.summary &&
                jobData.title
            );
        }

        return false;
    })();

    const findSummary = (episode: string, summaryTitle: string) => {
        const summaries = mapping[episode] ?? [];
        return summaries.find(s => s.title === summaryTitle);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div
                className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Create a new job
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Don't touch anything you are not aware
                    </p>
                </div>

                <form
                    className="flex flex-col"
                    // onSubmit={(e) => {
                    //     e.preventDefault();
                    //     handleSave();
                    // }}
                >
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Type</Label>
                                <Select
                                    options={constants.JOB_TYPES.map((a) => ({
                                        value: a.value,
                                        label: `${a.value}. ${a.label}`,
                                    }))}
                                    defaultValue={jobData.type ?? ""}
                                    placeholder="Select type"
                                    onChange={(change) =>
                                        setJobData((prev) => ({...prev, type: change}))
                                    }
                                    className={`col-span-3 lg:col-span-4`}
                                />
                            </div>

                            <div>
                                <Label>Series</Label>
                                <Select
                                    options={seriesList.map(a => ({
                                        value: a.id.toString(),
                                        label: a.name
                                    }))}
                                    defaultValue={""}
                                    placeholder="Select series"
                                    onChange={(option) =>
                                        setJobData((prev) => ({
                                            ...prev,
                                            series: option,
                                            episode2: "",
                                            summary: "",
                                        }))
                                    }
                                    className={`col-span-3 lg:col-span-4`}
                                />
                            </div>
                            {(jobData.type === constants.JOB_TYPES[0].value || jobData.type === constants.JOB_TYPES[3].value) && (
                                <div>
                                    <Label>Youtube Link</Label>
                                    <Input
                                        type="text"
                                        value={jobData.link}
                                        onChange={(e) =>
                                            setJobData((prev) => ({
                                                ...prev,
                                                link: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            )}
                            {jobData.type === constants.JOB_TYPES[1].value && (
                                <>
                                    <div>
                                        <Label>Youtube Link</Label>
                                        <Input
                                            type="text"
                                            value={jobData.link2}
                                            onChange={(e) =>
                                                setJobData((prev) => ({
                                                    ...prev,
                                                    link2: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Episode</Label>
                                        <Input
                                            type="text"
                                            value={jobData.episode}
                                            onChange={(e) =>
                                                setJobData((prev) => ({
                                                    ...prev,
                                                    episode: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </>
                            )}
                            {jobData.type === constants.JOB_TYPES[2].value && (
                                <>
                                    <div>
                                        <Label>Episode</Label>

                                        <Select
                                            disabled={!jobData.series}
                                            options={episodeOptions.map(ep => ({
                                                value: ep.value,
                                                label: ep.label
                                            }))}
                                            defaultValue={""}
                                            placeholder="Select Episode"
                                            onChange={(option) =>
                                                setJobData((prev) => ({
                                                    ...prev,
                                                    episode2: option,
                                                    summary: ""
                                                }))

                                            }
                                            className={`col-span-3 lg:col-span-4`}
                                        />
                                    </div>
                                    <div>
                                        <Label>Summary</Label>
                                        <Select
                                            disabled={!jobData.episode2}
                                            options={summaryOptions.map(sum => ({
                                                value: sum.value,
                                                label: sum.label
                                            }))}
                                            defaultValue={""}
                                            placeholder="Select Summary"
                                            onChange={(option) =>
                                                {
                                                    if (jobData.episode2){
                                                        const s = findSummary(jobData.episode2, option)
                                                        if (s) {
                                                            setJobData((prev) => ({
                                                                ...prev,
                                                                summary: s.text,
                                                                link3: s.link,
                                                                title: option
                                                            }))
                                                        }

                                                    }

                                                }
                                            }
                                            className={`col-span-3 lg:col-span-4`}
                                        />
                                    </div>
                                </>

                            )}
                        </div>
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm"
                                disabled={!isFormValid}
                            //@ts-expect-error fuck you
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    handleSave();
                                }
                                }>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
