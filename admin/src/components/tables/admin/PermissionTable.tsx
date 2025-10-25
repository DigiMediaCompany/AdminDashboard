import BaseTable from "../BaseTable.tsx";
import {Permission} from "../../../types/Admin.ts";
import PermissionItem from "./PermissionItem.tsx";
import {getApi} from "../../../services/commonApiService.ts";


export default function PermissionTable() {
    return (
        <>
            <BaseTable<Permission>
                fetchData={(page) => getApi<Permission>({
                    model: 'permissions',
                    page: page,
                    module: '/admin',
                    relation: 'user_permissions.user'
                })}
                renderRows={(items) => <PermissionItem permissions={items} />}
            />

        </>
    );
}
