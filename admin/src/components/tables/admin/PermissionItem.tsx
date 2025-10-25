import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {Permission, UserPermission} from "../../../types/Admin.ts";
import {useModal} from "../../../hooks/useModal.ts";
import {useState} from "react";
import PermissionUserModal from "../../modals/PermissionUserModal.tsx";
import {bulkDeleteApi, bulkInsertApi, deleteApi, updateApi} from "../../../services/commonApiService.ts";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import DeleteModal from "../../modals/DeleteModal.tsx";
import PermissionEditModal from "../../modals/PermissionEditModal.tsx";

interface PermissionItemProps {
    permissions: Permission[];
}

export default function PermissionItem({ permissions }: PermissionItemProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const {isOpen: isOpen2, openModal: openModal2, closeModal: closeModal2} = useModal();
    const {isOpen: isOpen3, openModal: openModal3, closeModal: closeModal3} = useModal();
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    return (
        <>
            <PermissionUserModal
                isOpen={isOpen}
                onClose={closeModal}
                permission={selectedPermission}
                onSave={(result) => {
                    if (result.permission?.user_permissions &&
                        result.permission.user_permissions.length > 0) {
                        bulkDeleteApi({
                            model: 'user_permissions',
                            module: '/admin',
                            ids: result.permission?.user_permissions.map((item) => item.id),
                        }).then(() => {})
                            .catch(() => {})
                    }
                    bulkInsertApi({
                        model: 'user_permissions',
                        module: '/admin',
                        payload: result.users.map((item) => ({
                            permission_id: result.permission?.id,
                            user_id: item.user_id,
                        })),
                    })
                        .then(() => {})
                        .catch(() => {})

                }}
            />
            <PermissionEditModal
                isOpen={isOpen2}
                onClose={closeModal2}
                permission={selectedPermission}
                onSave={(result) => {
                    updateApi<Permission>({
                        model: 'permissions',
                        module: '/admin',
                        id: result.permission.id,
                        payload: {
                            name: result.permission.name,
                            description: result.permission.description,
                        }
                    }).then(() => {
                        window.location.reload();
                    }).catch(() => {})

                }}
            />
            <DeleteModal
                isOpen={isOpen3}
                onClose={closeModal3}
                onSave={(result) => {
                    if (selectedPermission?.user_permissions && result) {
                        bulkDeleteApi<UserPermission>({
                            model: 'user_permissions',
                            module: '/admin',
                            ids: selectedPermission?.user_permissions?.map((item) => item.id),
                        }).then(() => {}).catch(() => {})
                        deleteApi<Permission>({
                            model: 'permissions',
                            module: '/admin',
                            id: selectedPermission?.id
                        }).then(() => {
                            window.location.reload();
                        }).catch(() => {})
                    }

                }}
            />
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            ID
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Name
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Description
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Action
                        </TableCell>
                    </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {permissions.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.id || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start"
                            >
                                <div  onClick={() => {
                                    if (s?.id) {
                                        const selectedPermission = permissions.find(obj => obj.id === s?.id)
                                        if (selectedPermission) {
                                            openModal()
                                            setSelectedPermission(selectedPermission)
                                        }

                                    }
                                }}
                                      className="cursor-pointer hover:text-brand-500">
                                    {s.name || "—"}

                                </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.description || "—"}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                        setSelectedPermission(s)
                                        if (s) {
                                            openModal2();
                                        }
                                    }}>
                                        <PencilSquareIcon className="w-6 h-6"/>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                        setSelectedPermission(s)
                                        if (s) {
                                            openModal3();
                                        }
                                    }}>
                                        <TrashIcon className="w-6 h-6"/>
                                    </button>
                                </div>
                            </TableCell>

                        </TableRow>


                    ))}
                </TableBody>
            </Table>
        </>
    );
};

