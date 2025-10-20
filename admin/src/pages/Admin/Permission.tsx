import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import PermissionTable from "../../components/tables/admin/PermissionTable.tsx";
import Toast from "../UiElements/Toast.tsx";
import {useState} from "react";
import {useModal} from "../../hooks/useModal.ts";
import PermissionModal from "../../components/modals/PermissionModel.tsx";
import {postApi} from "../../services/commonApiService.ts";

export default function Permission() {
    const { isOpen, openModal, closeModal } = useModal();
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
                    <PermissionTable />
                </ComponentCard>
            </div>
            <PermissionModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(permission) => {
                    postApi({
                        model: 'permissions',
                        payload: permission,
                        module: '/admin'
                    }).then(() => {
                        setToast({
                            show: true,
                            variant: "success",
                            title: "Created",
                            message: "Created successfully."
                        });
                        window.location.reload();
                    }).catch(() => {
                        setToast({
                            show: true,
                            variant: "error",
                            title: "Error",
                            message: "Failed."
                        });
                    })
                }}
            />
        </>
    );
}
