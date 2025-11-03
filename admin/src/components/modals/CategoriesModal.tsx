import { useState } from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";

interface CategoryData {
    name: string;
    description: string;
}

interface CategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: CategoryData) => void;
}

export default function CategoriesModal({
                                            isOpen,
                                            onClose,
                                            onSave,
                                        }: CategoriesModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Basic validation
        if (!name.trim()) {
            alert("Category name is required.");
            return;
        }

        onSave({ name: name.trim(), description: description.trim() });
        setName("");
        setDescription("");
        onClose();
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Create a category
                    </h4>
                    <p>

                    </p>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter category description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={handleClose}>
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
