import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import PermissionTable from "../../components/tables/admin/PermissionTable.tsx";
import Toast from "../UiElements/Toast.tsx";
import {useEffect, useState} from "react";
import {useModal} from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import {useParams} from "react-router";
import UserDetailSelectModal from "../../components/modals/UserDetailSelectModal.tsx";
import UserDetailTable from "../../components/tables/admin/UserDetailTable.tsx";

export default function Detail() {
    const { id } = useParams<{ id: string }>();


    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error";
        title: string;
        message: string;
    }>({
        show: false,
        variant: "success",
        title: "",
        message: ""
    });
    const { isOpen, openModal, closeModal } = useModal();


    if (!id) {
        return <p>Invalid route: missing id</p>;
    }


    return (
        <>
            {toast.show && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    changeState={() => setToast({ show: false,
                        variant: "success",
                        title: "",
                        message: ""
                    })}
                />
            )}
            <PageMeta/>
            <PageBreadcrumb pageTitle="Permissions" />
            <div className="space-y-6">
                <ComponentCard title="Permissions"
                               onClick={()=>{openModal()}}>
                    <UserDetailTable userId={id} />
                </ComponentCard>
            </div>
            <UserDetailSelectModal
                isOpen={isOpen}
                onClose={closeModal}
                userId={id}
                onSave={(result) => {
                    // if (result.permission?.user_permissions &&
                    //     result.permission.user_permissions.length > 0) {
                    //     bulkDeleteApi({
                    //         model: 'user_permissions',
                    //         module: '/admin',
                    //         ids: result.permission?.user_permissions.map((item) => item.id),
                    //     }).then(() => {})
                    //         .catch(() => {})
                    // }
                    // bulkInsertApi({
                    //     model: 'user_permissions',
                    //     module: '/admin',
                    //     payload: result.users.map((item) => ({
                    //         permission_id: result.permission?.id,
                    //         user_id: item.user_id,
                    //     })),
                    // })
                    //     .then(() => {})
                    //     .catch(() => {})


                // .then(() => {
                //         setToast({
                //             show: true,
                //             variant: "success",
                //             title: "Created",
                //             message: "Created successfully."
                //         });
                //         window.location.reload();
                //     }).catch(() => {
                //         setToast({
                //             show: true,
                //             variant: "error",
                //             title: "Error",
                //             message: "Failed."
                //         });
                //     })
                }}
            />
        </>
    );
}
