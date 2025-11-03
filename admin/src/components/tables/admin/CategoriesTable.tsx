import { getApi } from "../../../services/adminArticleService.ts";
import BaseTable from "../BaseTable.tsx";
import {Category} from "../../../types/Article.ts";
import CategoriesItem from "./CategoriesItem.tsx";


export default function CategoriesTable() {
    return (
        <>
            <BaseTable<Category>
                fetchData={(page) => getApi<Category>('categories', page)}
                renderRows={(items) => <CategoriesItem series={items} />}
            />

        </>
    );
}
