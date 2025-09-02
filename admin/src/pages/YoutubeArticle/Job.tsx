import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArticleJobTable from "../../components/tables/ArticleJobTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import JobModal from "../../components/modals/JobModal.tsx";

export default function Job() {
    const { isOpen, openModal, closeModal } = useModal();
    return (
        <>
            <PageMeta/>
            <PageBreadcrumb pageTitle="Articles" />
            <div className="space-y-6">
                <ComponentCard title="Jobs" desc="asdasd" onClick={()=>{openModal()}}>
                    <ArticleJobTable />
                </ComponentCard>
            </div>
            <JobModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(updatedQuiz) => {
                    console.log(updatedQuiz);
                }}
            />
        </>
    );
}
