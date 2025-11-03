import { useEffect, useState } from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { useAppSelector } from "../../store";
import { constants } from "../../utils/constants.ts";
import { User } from "../../types/Admin.ts";

interface OnSaveType {
    user: User;
}

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (result: OnSaveType) => void;
    user: User | null;
}

export default function UserEditModal({
                                          isOpen,
                                          onClose,
                                          onSave,
                                          user,
                                      }: UserEditModalProps) {
    const [userData, setUserData] = useState<User | null>(null);

    const authState = useAppSelector((state) => state.auth);
    const role = authState.user?.user_metadata?.role;
    const currentUserId = authState.user?.user_metadata?.id;

    useEffect(() => {
        // Reset data when modal opens or closes
        if (isOpen && user) {
            setUserData(user);
        } else if (!isOpen) {
            setUserData(null);
        }
    }, [user, isOpen]);

    const handleChange = (field: keyof User, value: string) => {
        setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!userData) return;

        if (!userData.name?.trim()) {
            alert("Name cannot be empty.");
            return;
        }

        onSave({ user: userData });
        onClose();
    };

    const handleClose = () => {
        setUserData(null);
        onClose();
    };

    const canEdit =
        role === constants.ROLES.SUPER_ADMIN || currentUserId === user?.supabase_id;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit user
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
                                    value={userData?.name || ""}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={userData?.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={handleClose}>
                            Close
                        </Button>

                        {canEdit && (
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
