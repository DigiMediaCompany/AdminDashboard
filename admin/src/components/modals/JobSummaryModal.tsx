import {useEffect, useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import TextArea from "../form/input/TextArea.tsx";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import {Job} from "../../types/Article.ts";

interface JobData {
    summaries: string[];
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: JobData) => void;
    text: string;
    data: Job;
}

export default function JobSummaryModal({
                                            isOpen,
                                            onClose,
                                            onSave,
                                            text,
    data
                                        }: BaseModalProps) {

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
        onSave({
            summaries: summaries
        });
        onClose()
    };

    const handleAdd = () => {
        setSummaries((prev) => [...prev, ""]);
    };

    const [summaries, setSummaries] = useState<string[]>([]);
    const handleChange = (index: number, value: string) => {
        const updated = [...summaries];
        updated[index] = value;
        setSummaries(updated);
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

                        {summaries.map((sum, index) => (
                            <div key={index}>
                                <Label>Context {index + 1}</Label>
                                <TextArea
                                    rows={5}
                                    value={sum}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                        ))}


                        <PlusCircleIcon className="w-6 h-6 text-gray-400" onClick={() => {
                            handleAdd()
                        }}/>
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
