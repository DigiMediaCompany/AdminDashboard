import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArticleJobTable from "../../components/tables/ArticleJobTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import JobModal from "../../components/modals/JobModal.tsx";
import {postApi} from "../../services/adminArticleService.ts";
import Toast from "../UiElements/Toast.tsx";
import {useState} from "react";

export default function Job() {
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
            <PageBreadcrumb pageTitle="Jobs" />
            <div className="space-y-6">
                <ComponentCard title="Jobs" desc="Create an article from Youtube link jobs"
                               onClick={()=>{openModal()}}>
                    <ArticleJobTable />
                </ComponentCard>
            </div>
            <JobModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(data) => {
                    postApi('jobs', {
                        raw_youtube_link: data.name,
                        youtube_id: data.name,
                        series_id: data.series
                    }).then(() => {
                        setToast({
                            show: true,
                            variant: "success",
                            title: "Created",
                            message: "Created successfully."
                        });

                    }).catch(() => {
                        setToast({
                            show: true,
                            variant: "error",
                            title: "Error",
                            message: "Failed."
                        });
                    }).finally(() => {
                        window.location.reload();
                    })
                }}
            />
        </>
    );
}
