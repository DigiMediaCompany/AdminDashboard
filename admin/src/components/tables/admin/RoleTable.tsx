import { getApi } from "../../../services/adminArticleService.ts";
import BaseTable from "../BaseTable.tsx";
import {Role} from "../../../types/Admin.ts";
import RoleItem from "./RoleItem.tsx";


export default function RoleTable() {
    return (
        <>
            <BaseTable<Role>
                fetchData={(page) => getApi<Role>('users', page)}
                renderRows={(items) => <RoleItem roles={items} />}
            />

        </>
    );
}
