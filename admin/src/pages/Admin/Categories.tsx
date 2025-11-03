import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {useModal} from "../../hooks/useModal.ts";
import {postApi} from "../../services/adminArticleService.ts";
import {useState} from "react";
import Toast from "../UiElements/Toast.tsx";
import CategoriesTable from "../../components/tables/admin/CategoriesTable.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import CategoriesModal from "../../components/modals/CategoriesModal.tsx";
import {constants} from "../../utils/constants.ts";

export default function Categories() {
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
            <PageBreadcrumb pageTitle="Categories" />
            <div className="space-y-6">
                <ComponentCard title="Categories"
                onClick={()=>{openModal()}}>
                    <CategoriesTable />
                </ComponentCard>
            </div>
            <CategoriesModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(category) => {
                    postApi('categories', {
                        name: category.name,
                        description: category.description,
                        type: constants.CATEGORY_TYPES.WEBSITE
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
