import {useEffect, useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import {Job, Series} from "../../types/Article.ts";
import Label from "../form/Label.tsx";
import Select from "../form/Select.tsx";

interface JobData {
    selectedSummary: string;
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: JobData) => void;
    text: string;
    data: Job;
}

export default function JobSelectSummaryModal({
                                            isOpen,
                                            onClose,
                                            onSave,
                                            text,
                                            data
                                        }: BaseModalProps) {

    const [summaries, setSummaries] = useState<string[]>([]);
    const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
    useEffect(() => {
        if (isOpen) {
            const detail = JSON.parse(data.detail)
            if (detail.summaries) {
                setSummaries(detail.summaries);
            } else {
                setSummaries([]);
            }

        }
    }, [isOpen]);
    const handleSave = () => {
        if (selectedSummary) {
            onSave({selectedSummary});
        }

        onClose()
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
                        Review {text}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Don't touch anything you are not aware
                    </p>
                </div>

                <form
                    className="flex flex-col"
                >
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                            <Label>Series</Label>
                            <Select
                                options={summaries.map(a => ({
                                    value: a,
                                    label: a
                                }))}
                                // defaultValue={""}
                                placeholder="Select series"
                                onChange={(change) => {
                                    setSelectedSummary(change)
                                }}
                                className={`col-span-3 lg:col-span-4`}
                            />

                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            handleSave();
                        }}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
