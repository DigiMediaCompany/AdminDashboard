
import {useEffect, useMemo, useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import {Permission, UserPermission} from "../../types/Admin.ts";
import {getApi} from "../../services/commonApiService.ts";
import Select from "../form/Select.tsx";
import {useAppSelector} from "../../store";
import {constants} from "../../utils/constants.ts";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: unknown) => void;
    userId: string | null;
}


export default function UserModal({
                                            isOpen,
                                            onClose,
                                            onSave,
                                            userId
                                        }: BaseModalProps) {
    // const [quiz, setQuiz] = useState<string>();

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);

    // Track which permission_id is currently selected (but not yet added)
    const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null);

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        onSave({
            permissions: userPermissions,
            userId
        })
        setUserPermissions([])
        onClose()
    };
    const authState = useAppSelector((state) => state.auth)
    const role = authState.user?.user_metadata?.role;

    // TODO: get permission list from outside
    useEffect(() => {
        if (!userId) return;
        getApi<Permission>({
            model: 'permissions',
            module: '/admin'
        })
            .then(result => {
                setPermissions(result.data);
            })
            .catch(() => {
            })
        getApi<UserPermission>({
            model: 'user_permissions',
            module: '/admin'
        })
            .then(result => {
                setUserPermissions(result.data)
            })
            .catch(() => {
            })
    }, [userId, isOpen])

    // const permissionOptions = [
    //     { value: "1", label: "Showcase" },
    //     { value: "3", label: "Admin dashboard"},
    //     { value: "4", label: "Usagag" },
    //     { value: "5", label: "Youtube Article"},
    //     { value: "6", label: "PostFunny" },
    //     { value: "7", label: "FreeApk" },
    //     { value: "8", label: "GonoGame" },
    //     { value: "9", label: "MzGenz" },
    //     { value: "10", label: "TikGame"},
    // ];

    // Map permission_id -> label for quick lookup when rendering the chips
    const optionLabelById = useMemo(() => {
        const map = new Map<string, string>();
        permissions.forEach(o => map.set(o.id.toString(), o.name));
        return map;
    }, [permissions]);

    // Prevent duplicates: available options are those not already present in userPermissions (by permission_id)
    const availableOptions = useMemo(() => {
        const chosen = new Set(userPermissions.map(up => String(up.permission_id)));
        return permissions
            .filter(per => !chosen.has(String(per.id)))
            .map(perm => ({
                value: perm.id.toString(),
                label: perm.name,
            }));
    }, [userPermissions, permissions]);

    // Add a new UserPermission (default allowed = 1); you can tweak defaults as needed
    const handleAddPermission = () => {
        if (!selectedPermissionId) return;
        const already = userPermissions.some(up => String(up.permission_id) === selectedPermissionId);
        if (already) return;

        // Build a new UserPermission object (id can be undefined or temp; backend should assign)
        const now = new Date().toISOString();
        const newUP: UserPermission = {
            id: 0,               // temp or omit if your type allows; backend should set real id
            user_id: 0,          // fill in real user_id if known here; otherwise keep 0/placeholder
            permission_id: Number(selectedPermissionId),
            allowed: 1,
            assigned_by: null,
            updated_at: now,
            // optional relations left undefined
        };

        setUserPermissions(prev => [...prev, newUP]);
        setSelectedPermissionId(null);
    };

    const handleRemovePermission = (permissionId: number) => {
        setUserPermissions(prev => prev.filter(up => up.permission_id !== permissionId));
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
                        Add permission to user
                    </h4>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}

                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            {/*<div>*/}
                            {/*    <Label>Permission</Label>*/}
                            {/*    <Select*/}
                            {/*        options={permissionOptions}*/}
                            {/*        placeholder="Select Option"*/}
                            {/*        onChange={setUserPermissions}*/}
                            {/*        className="dark:bg-dark-900"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            {/* ===== Permissions Composer ===== */}
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                {/* Composer */}
                                <div>
                                    {role === constants.ROLES.SUPER_ADMIN ? (<>
                                        <Label>Permission</Label>

                                        {/* Dropdown with only available (non-duplicate) permissions */}
                                        <Select
                                            value={selectedPermissionId ?? ""}
                                            options={availableOptions}
                                            placeholder={availableOptions.length ? "Select permission to add" : "All permissions added"}
                                            onChange={(opt) => {
                                                setSelectedPermissionId(opt);
                                            }}
                                            className="dark:bg-dark-900"
                                        />

                                        <div className="mt-3">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAddPermission();
                                                }}
                                                disabled={!selectedPermissionId}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </>) : ("")}


                                    {/* Render current userPermissions as removable chips */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {userPermissions.map((up) => {
                                            const key = String(up.permission_id);
                                            const label = optionLabelById.get(key) ?? `Permission #${key}`;
                                            return (
                                                <div
                                                    key={key}
                                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm dark:border-gray-700"
                                                >
                                                    <span className="text-gray-800 dark:text-gray-100">{label}</span>

                                                    {/* Delete icon */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePermission(up.permission_id)}
                                                        className="group inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                                                        aria-label={`Remove ${label}`}
                                                        title={`Remove ${label}`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className="h-4 w-4 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 0 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10l4.293-4.293a1 1 0 1 0-1.414-1.414L10 8.586Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {role === constants.ROLES.SUPER_ADMIN ? (<>
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </>) : null}

                    </div>
                </form>
            </div>
        </Modal>
    );
}
