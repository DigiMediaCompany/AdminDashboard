import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import UserTable from "../../components/tables/admin/UserTable.tsx";

export default function User() {

    return (
        <>
            <PageMeta/>
            <PageBreadcrumb pageTitle="Users" />
            <div className="space-y-6">
                <ComponentCard title="Users" desc="Manage your users and their roles"
                               onClick={()=>{}}>
                    <UserTable />
                </ComponentCard>
            </div>
        </>
    );
}
