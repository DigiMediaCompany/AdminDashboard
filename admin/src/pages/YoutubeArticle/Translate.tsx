import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import QuizTable from "../../components/tables/QuizTable.tsx";

export default function Translate() {
    return (
        <>
            <PageMeta
            />
            <PageBreadcrumb pageTitle="Articles" />
            <div className="space-y-6">
                <ComponentCard title="Jobs">
                    <QuizTable />
                </ComponentCard>
            </div>
        </>
    );
}
