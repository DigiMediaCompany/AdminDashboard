import BaseTable from "../BaseTable.tsx";
import {User} from "../../../types/Admin.ts";
import UserItem from "./UserItem.tsx";
import {getApi} from "../../../services/commonApiService.ts";


export default function UserTable() {
    return (
        <>
            <BaseTable<User>
                fetchData={(page) => getApi<User>({
                    model: 'users',
                    page: page,
                    relation: 'user_permissions',
                    module: '/admin'
                })}
                renderRows={(items) => <UserItem users={items} />}
            />

        </>
    );
}
