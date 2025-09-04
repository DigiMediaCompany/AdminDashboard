import {useEffect, useState} from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import {getApi} from "../../services/adminArticleService.ts";
import {Series} from "../../types/Article.ts";
import Select from "../form/Select.tsx";
import TextArea from "../form/input/TextArea.tsx";

interface JobData {
    name: string;
    series?: number
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: JobData) => void;
    text: string;
    file: string;
}

export default function JobContextModal({
                                     isOpen,
                                     onClose,
                                     onSave,
    text,
    file
                                 }: BaseModalProps) {
    const [name, setName] = useState<string>(text);
    const [original, setOriginal] = useState<string>(text);
    const [series, setSeries] = useState<Series[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<number | null>(null);

    const handleSave = () => {
        onSave({
            name: name,
            series: selectedSeries
        });
        onClose()
    };

    useEffect(() => {
        getApi<Series>('series')
            .then(result => {
                setSeries(result.data);
            })
            .catch(() => {
            })
    }, [])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Review context
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
                                <Label>Context</Label>
                                <TextArea
                                    value={original}
                                    rows={40}
                                    disabled={true}
                                />

                            </div>
                            <div>
                                <Label>Review</Label>
                                <TextArea
                                    value={name}
                                    rows={40}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
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
