import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArticleJobTable from "../../components/tables/ArticleJobTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import JobModal from "../../components/modals/JobModal.tsx";
import {postApi} from "../../services/adminArticleService.ts";
import Toast from "../UiElements/Toast.tsx";
import {useState} from "react";
import {constants} from "../../utils/constants.ts";

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
                    const job = {
                        link: ""
                    }

                    switch (data.type) {
                        case constants.JOB_TYPES[0].value:
                            if (data.link) {
                                job.link = data.link
                            } else {
                                throw new Error("No valid link");
                            }
                            break;
                        case constants.JOB_TYPES[1].value:
                            if (data.link2) {
                                job.link = data.link2
                            } else {
                                throw new Error("No valid link");
                            }
                            break;
                        default:
                            throw new Error("No valid type");
                    }
                    postApi('jobs', {
                        detail: JSON.stringify(job),
                        series_id: data.series,
                        type: parseInt(data.type)
                    }).then(() => {
                        setToast({
                            show: true,
                            variant: "success",
                            title: "Created",
                            message: "Created successfully."
                        });
                        // TODO: update the list locally, to do this, api rewrite is needed
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
