import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {User} from "../../../types/Admin.ts";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import UserModal from "../../modals/UserModal.tsx";
import {useModal} from "../../../hooks/useModal.ts";
import {useState} from "react";

interface UserItemProps {
    users: User[];
}

export default function UserItem({ users }: UserItemProps) {
    const { isOpen, openModal, closeModal } = useModal();

    return (
        <>
            <UserModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(permission) => {
                    console.log(permission);
                    // postApi({
                    //     model: 'permissions',
                    //     payload: permission,
                    //     module: '/admin'
                    // }).then(() => {
                    //     setToast({
                    //         show: true,
                    //         variant: "success",
                    //         title: "Created",
                    //         message: "Created successfully."
                    //     });
                    //     window.location.reload();
                    // }).catch(() => {
                    //     setToast({
                    //         show: true,
                    //         variant: "error",
                    //         title: "Error",
                    //         message: "Failed."
                    //     });
                    // })
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
                            Permissions
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
                                {s.name || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.email || "—"}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.name || "—"}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                        // setSelectedQuiz(quizzes[index]);
                                        openModal();
                                    }}>
                                        <PencilSquareIcon className="w-6 h-6" />
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                                        // setSelectedQuiz(quizzes[index]);
                                        // openModal();
                                    }}>
                                        <TrashIcon className="w-6 h-6" />
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

