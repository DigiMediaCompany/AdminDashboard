import BaseTable from "../BaseTable.tsx";
import {User} from "../../../types/Admin.ts";
import UserItem from "./UserItem.tsx";
import {getApi} from "../../../services/commonApiService.ts";
import {useAppSelector} from "../../../store";
import {constants} from "../../../utils/constants.ts";


export default function UserTable() {
    const authState = useAppSelector((state) => state.auth)
    const role = authState.user?.user_metadata?.role;
    return (
        <>
            <BaseTable<User>
                fetchData={(page) => getApi<User>({
                    model: 'users',
                    page: page,
                    relation: 'user_permissions',
                    module: '/admin',
                    filter:
                        role !== constants.ROLES.SUPER_ADMIN
                            ? { email: authState.user?.email }
                            : {}
                })}
                renderRows={(items) => <UserItem users={items} />}
            />

        </>
    );
}
