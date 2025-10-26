import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import {Permission, UserPermission } from "../../types/Admin.ts";
import Select, {Option} from "../form/Select.tsx";
import {getApi} from "../../services/commonApiService.ts";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (result: OnSaveType) => void;
    userId: string;
}

interface OnSaveType {
    permission: Permission;
}

export default function UserDetailSelectModal({
                                                  isOpen,
                                                  onClose,
                                                  onSave,
                                                  userId,
                                              }: BaseModalProps) {
    const [userPermissions, setUserPermissions] = useState<UserPermission[] >([]);

    const availableUserPerms: Option[] = useMemo(() => {
        if (userPermissions) {
            userPermissions.map<Option>((up) => ({
                value: up.permission_id.toString(),
                label: up.permission?.name || "-",
            }));
        } else {
            return []
        }
    }, [userPermissions]);


    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
       getApi<UserPermission>({
            model: 'user_permissions',
            module: '/admin',
            relation: 'user_permissions.user',
            filter: {
                user_id: `!${userId}`
            }
        }).then((result) => setUserPermissions(result.data) )


    }, [userId]);

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selected) return;
        const selectedPermission = userPermissions.find(a => a.id.toString() === selected)
        if (selectedPermission) {
            onSave({ permission: selectedPermission});
        }
        setSelected(null);
        onClose();
    };

    const nothingAvailable = availableUserPerms.length === 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full m-4 lg:max-w-[900px]">
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Add user to permission
                    </h4>
                </div>

                <form className="flex flex-col">
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Permission</Label>
                                <Select
                                    value={selected}
                                    options={availableUserPerms}
                                    placeholder={
                                        nothingAvailable ? "All permissions added" : "Select a permission"
                                    }
                                    onChange={(opt) => setSelected(opt)}
                                    disabled={nothingAvailable}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={!selected || nothingAvailable}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
