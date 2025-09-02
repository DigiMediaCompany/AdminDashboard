
import {useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";

interface BaseModalProps {
    isOpen: boolean;
    inputData: object | null;
    onClose: () => void;
    onSave: (quiz: unknown) => void;
}

export default function BaseModal({
                                          isOpen,
                                        inputData,
                                          onClose,
                                          onSave,
                                      }: BaseModalProps) {
    const [quiz, setQuiz] = useState<unknown | null>(inputData);

    const handleSave = () => {
        if (quiz) onSave(quiz);
    };



    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Quiz
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Don't touch anything you are not aware
                    </p>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                            Basic
                        </h5>

                        {/*<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">*/}
                        {/*    <div>*/}
                        {/*        <Label>Id</Label>*/}
                        {/*        <Input type="text" value={quiz?.id} disabled />*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
