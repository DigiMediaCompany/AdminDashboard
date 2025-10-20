import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import RoleTable from "../../components/tables/admin/RoleTable.tsx";

export default function Role() {

    return (
        <>
            <PageMeta/>
            <PageBreadcrumb pageTitle="Roles" />
            <div className="space-y-6">
                <ComponentCard title="Roles"
                               onClick={()=>{}}>
                    <RoleTable />
                </ComponentCard>
            </div>
        </>
    );
}
