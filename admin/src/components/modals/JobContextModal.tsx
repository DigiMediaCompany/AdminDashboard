import {useEffect, useState} from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import TextArea from "../form/input/TextArea.tsx";
import { getFile } from "../../services/postFunnyService.ts";
import {Job} from "../../types/Article.ts";

interface JobData {
    fixed: string | null;
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: JobData) => void;
    text: string;
    data: Job;
}

export default function JobContextModal({
                                     isOpen,
                                     onClose,
                                     onSave,
    text,
                                            data
                                 }: BaseModalProps) {
    const [fixed, setFixed] = useState<string>("");
    const [original, setOriginal] = useState<string>("");

    const handleSave = () => {
        onSave({
            fixed: fixed,
        });
        onClose()
    };

    useEffect(() => {
        if (isOpen && data) {
            const detail = JSON.parse(data.detail)
            let file
            if (text === 'Article') {
                file = detail.article_file
            } else {
                file = detail.context_file
            }
            getFile(file)
                .then((result) => result.text())
                .then((text) => {
                    setOriginal(text);
                    setFixed(text);
                })
                .catch((err) => console.error(err));
        }
    }, [isOpen, data]);

    useEffect(() => {
        if (!isOpen) {
            setOriginal("");
            setFixed("");
        }
    }, [isOpen]);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
                                    value={fixed}
                                    rows={40}
                                    onChange={(e: string) => setFixed(e)}
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
