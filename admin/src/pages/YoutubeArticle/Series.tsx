import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import SeriesTable from "../../components/tables/article/SeriesTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import SeriesModal from "../../components/modals/SeriesModal.tsx";
import {postApi} from "../../services/adminArticleService.ts";
import {useState} from "react";
import Toast from "../UiElements/Toast.tsx";

export default function Series() {
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
            <PageBreadcrumb pageTitle="Series" />
            <div className="space-y-6">
                <ComponentCard title="Series" desc="For big context, add job to a series"
                onClick={()=>{openModal()}}>
                    <SeriesTable />
                </ComponentCard>
            </div>
            <SeriesModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(series) => {
                    postApi('series', {
                        name: series,
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
