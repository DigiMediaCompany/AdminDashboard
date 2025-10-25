import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {Permission} from "../../../types/Admin.ts";
import {useModal} from "../../../hooks/useModal.ts";
import {useState} from "react";
import PermissionUserModal from "../../modals/PermissionUserModal.tsx";

interface PermissionItemProps {
    permissions: Permission[];
}

export default function PermissionItem({ permissions }: PermissionItemProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    return (
        <>
            <PermissionUserModal
                isOpen={isOpen}
                onClose={closeModal}
                permission={selectedPermission}
                onSave={(result) => {
                    console.log(result)
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
                            Name
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Description
                        </TableCell>
                    </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {permissions.map((s) => (
                        <TableRow key={s.id}>
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
                                    {s?.id && s?.name ? `${s.id}. ${s.name}` : "—"}

                                </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {s.description || "—"}
                            </TableCell>

                        </TableRow>


                    ))}
                </TableBody>
            </Table>
        </>
    );
};

