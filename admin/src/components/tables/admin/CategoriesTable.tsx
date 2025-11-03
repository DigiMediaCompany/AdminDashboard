import BaseTable from "../BaseTable.tsx";
import {Category} from "../../../types/Article.ts";
import CategoriesItem from "./CategoriesItem.tsx";
import { getApi } from "../../../services/commonApiService.ts";
import {constants} from "../../../utils/constants.ts";


export default function CategoriesTable() {
    return (
        <>
            <BaseTable<Category>
                fetchData={(page) => getApi<Category>({
                    model: 'categories',
                    module: '/article',
                    page: page,
                    filter: {
                        type: constants.CATEGORY_TYPES.WEBSITE
                    }
                })}
                renderRows={(items) => <CategoriesItem categories={items} />}
            />

        </>
    );
}
