
import {useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: unknown) => void;
}

interface PermissionData {
    name: string,
    description: string,
}

export default function PermissionModal({
                                        isOpen,
                                        onClose,
                                        onSave,
                                    }: BaseModalProps) {
    // const [quiz, setQuiz] = useState<string>();
    const [permissionData, setPermissionData] = useState<PermissionData>({
        name: "",
        description: "",
    });

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (permissionData) {
            onSave(permissionData);
            setPermissionData({
                name: "",
                description: ""
            })
        }
        onClose()
    };



    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className=" text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Create a new permission
                    </h4>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    value={permissionData.name}
                                    onChange={(e) =>
                                        setPermissionData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    value={permissionData.description}
                                    onChange={(e) =>
                                        setPermissionData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

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
