import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import SeriesTable from "../../components/tables/article/SeriesTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import BaseModal from "../../components/modals/BaseModal.tsx";
import SeriesModal from "../../components/modals/SeriesModal.tsx";

export default function Series() {
    const { isOpen, openModal, closeModal } = useModal();

    return (
        <>
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
                inputData={null}
                onClose={closeModal}
                onSave={(updatedQuiz) => {
                    console.log(updatedQuiz);
                }}
            />
        </>
    );
}
