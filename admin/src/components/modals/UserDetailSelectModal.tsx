import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Select, { Option } from "../form/Select.tsx";
import { getApi } from "../../services/commonApiService.ts";
import { Permission, UserPermission } from "../../types/Admin.ts";

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
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [currentUserPermissions, setCurrentUserPermissions] = useState<UserPermission[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Fetch data
    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setErr(null);

                // 1) All permissions
                const permsRes = await getApi<Permission>({
                    model: "permissions",
                    module: "/admin",
                });

                // 2) Current user's user_permissions (include permission if your API supports relations)
                const userPermsRes = await getApi<UserPermission>({
                    model: "user_permissions",
                    module: "/admin",
                    relation: "user_permissions.permission",
                    filter: { user_id: userId }, // equality; remove '!' — you want THIS user's permissions
                });

                if (cancelled) return;
                setAllPermissions(permsRes.data ?? []);
                setCurrentUserPermissions(userPermsRes.data ?? []);
            } catch (e: any) {
                if (!cancelled) setErr(e?.message ?? "Failed to load permissions");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    // Compute available permissions = all - already assigned
    const availableUserPerms: Option[] = useMemo(() => {
        const assignedIds = new Set(
            (currentUserPermissions ?? []).map((up) => up.permission_id)
        );
        return (allPermissions ?? [])
            .filter((p) => !assignedIds.has(p.id))
            .map<Option>((p) => ({
                value: String(p.id),
                label: p.name ?? "-",
            }));
    }, [allPermissions, currentUserPermissions]);

    const nothingAvailable = availableUserPerms.length === 0;

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selected) return;

        const selectedPermission = allPermissions.find(
            (p) => String(p.id) === selected
        );
        if (!selectedPermission) return;

        onSave({ permission: selectedPermission });
        setSelected(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full m-4 lg:max-w-[900px]">
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Add user to permission
                    </h4>
                    {err && (
                        <p className="mt-2 text-sm text-red-600">
                            {err}
                        </p>
                    )}
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
                                        loading
                                            ? "Loading permissions…"
                                            : nothingAvailable
                                                ? "All permissions already assigned"
                                                : "Select a permission"
                                    }
                                    onChange={(value) => setSelected(value)}
                                    disabled={loading || nothingAvailable}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!selected || loading || nothingAvailable}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
