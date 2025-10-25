import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import { useCallback } from "react";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (result: boolean) => void;
}

export default function DeleteModal({
                                        isOpen,
                                        onClose,
                                        onSave,
                                    }: BaseModalProps) {
    const handleSave = useCallback(() => {
        onSave(true);
        onClose();
    }, [onSave, onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[500px]"
        >
            <div className="no-scrollbar relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
                <div className="mb-6">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Confirm Delete
                    </h4>
                    <p className="mt-6 text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete this item? This action cannot be undone.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <Button size="sm" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="sm" variant="primary" onClick={handleSave}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
