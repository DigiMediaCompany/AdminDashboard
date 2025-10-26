import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {UserPermission} from "../../../types/Admin.ts";
import {useModal} from "../../../hooks/useModal.ts";
import {useState} from "react";
import { deleteApi} from "../../../services/commonApiService.ts";
import { TrashIcon} from "@heroicons/react/24/outline";
import DeleteModal from "../../modals/DeleteModal.tsx";

interface UserDetailItemProps {
    userPermissions: UserPermission[];
}

export default function UserDetailItem({ userPermissions }: UserDetailItemProps) {
    const {isOpen, openModal, closeModal} = useModal();
    const [selectedUserPermission, setSelectedUserPermission] = useState<UserPermission | null>(null);
    return (
        <>

            <DeleteModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(result) => {
                    if (selectedUserPermission && result) {
                        deleteApi<UserPermission>({
                            model: 'user_permissions',
                            module: '/admin',
                            id: selectedUserPermission.id
                        }).then(() => {
                            window.location.reload();
                        }).catch(() => {})
                    }
                    setSelectedUserPermission(null)

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
                    {userPermissions.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.id || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.permission?.name || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.permission?.description || "—"}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <div className="flex items-center gap-3">

                                    <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                        setSelectedUserPermission(s || null)
                                        if (s) {
                                            openModal();
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

