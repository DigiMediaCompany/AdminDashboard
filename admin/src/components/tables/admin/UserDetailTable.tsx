import BaseTable from "../BaseTable.tsx";
import {UserPermission} from "../../../types/Admin.ts";
import {getApi} from "../../../services/commonApiService.ts";
import UserDetailItem from "./UserDetailItem.tsx";

interface UserDetailProps {
    userId: string | null
}

export default function UserDetailTable({
                                            userId
                                        }: UserDetailProps) {


    return (
        <>
            <BaseTable<UserPermission>
                fetchData={(page) => getApi<UserPermission>({
                    model: 'user_permissions',
                    page: page,
                    module: '/admin',
                    relation: 'permission',
                    filter: {
                        user_id: userId || ""
                    }
                })}
                renderRows={(items) => <UserDetailItem userPermissions={items} />}
            />

        </>
    );
}
