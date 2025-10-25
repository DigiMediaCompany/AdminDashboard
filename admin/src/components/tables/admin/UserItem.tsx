import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {User, UserPermission} from "../../../types/Admin.ts";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import UserModal from "../../modals/UserModal.tsx";
import {useModal} from "../../../hooks/useModal.ts";
import {useState} from "react";
import {bulkDeleteApi, bulkInsertApi, deleteApi, getApi, updateApi} from "../../../services/commonApiService.ts";
import UserEditModal from "../../modals/UserEditModal.tsx";
import {useAppSelector} from "../../../store";
import {constants} from "../../../utils/constants.ts";
import DeleteModal from "../../modals/DeleteModal.tsx";

interface UserItemProps {
    users: User[];
}

export default function UserItem({users}: UserItemProps) {
    const {isOpen, openModal, closeModal} = useModal();
    const {isOpen: isOpen2, openModal: openModal2, closeModal: closeModal2} = useModal();
    const {isOpen: isOpen3, openModal: openModal3, closeModal: closeModal3} = useModal();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const authState = useAppSelector((state) => state.auth)
    const role = authState.user?.user_metadata?.role;
    const currentUserId = authState.user?.user_metadata?.id

    const isAllowedToEdit = (user: User) => {
        return role === constants.ROLES.SUPER_ADMIN || currentUserId === user?.supabase_id
    };

    return (
        <>
            <UserModal
                isOpen={isOpen}
                onClose={closeModal}
                user={selectedUser}
                onSave={(result) => {
                    getApi<UserPermission>({
                        model: 'user_permissions',
                        module: '/admin',
                        filter: {
                            user_id: result.user.id.toString()
                        }
                    }).then((data) => {
                        bulkDeleteApi({
                            model: 'user_permissions',
                            module: '/admin',
                            ids: data.data.map((item) => item.id),
                        }).then(() => {
                            bulkInsertApi({
                                model: 'user_permissions',
                                module: '/admin',
                                payload: result.permissions.map((item) => ({
                                    permission_id: item.permission_id,
                                    user_id: result.user.id,
                                })),
                            }).then(() => {
                            }).catch(() => {
                            });
                        })
                    }).catch(() => console.log("crap"))

                }}
            />
            <UserEditModal
                isOpen={isOpen2}
                onClose={closeModal2}
                user={selectedUser}
                onSave={(result) => {
                    updateApi<User>({
                        model: 'users',
                        module: '/admin',
                        id: result.user.id,
                        payload: {
                            name: result.user.name
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
                    if (selectedUser?.user_permissions && result) {
                        bulkDeleteApi<UserPermission>({
                            model: 'user_permissions',
                            module: '/admin',
                            ids: selectedUser?.user_permissions?.map((item) => item.id),
                        }).then(() => {}).catch(() => {})
                        deleteApi<User>({
                            model: 'users',
                            module: '/admin',
                            id: selectedUser?.id
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
                            Email
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
                    {users.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.id || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div  onClick={() => {
                                    if (isAllowedToEdit(s)) {
                                        setSelectedUser(s)
                                        if (s) {
                                            openModal();
                                        }
                                    }

                                }}
                                      className={`${isAllowedToEdit(s) ? "cursor-pointer hover:text-brand-500" : ""}`}
                                >
                                    {s.name || "—"}

                                </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.email || "—"}
                            </TableCell>

                            {isAllowedToEdit(s) ?
                            (
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                            setSelectedUser(s)
                                            if (s) {
                                                openModal2();
                                            }
                                        }}>
                                            <PencilSquareIcon className="w-6 h-6"/>
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                            setSelectedUser(s)
                                            if (s) {
                                                openModal3();
                                            }
                                        }}>
                                            <TrashIcon className="w-6 h-6"/>
                                        </button>
                                    </div>
                                </TableCell>
                            ): null}


                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>

    );
};

