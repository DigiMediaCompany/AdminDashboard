import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArticleTable from "../../components/tables/ArticleTable.tsx";

export default function Articles() {
    return (
        <>
            <PageMeta
        />
        <PageBreadcrumb pageTitle="Articles" />
        <div className="space-y-6">
        <ComponentCard title="Jobs" desc="asdasd">
            <ArticleTable />
            </ComponentCard>
            </div>
            </>
    );
}
