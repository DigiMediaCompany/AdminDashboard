import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import SeriesTable from "../../components/tables/article/SeriesTable.tsx";

export default function User() {

    return (
        <>
            <PageMeta/>
            <PageBreadcrumb pageTitle="Series" />
            <div className="space-y-6">
                <ComponentCard title="Series" desc="For big context, add job to a series"
                               onClick={()=>{}}>
                    <SeriesTable />
                </ComponentCard>
            </div>
        </>
    );
}
