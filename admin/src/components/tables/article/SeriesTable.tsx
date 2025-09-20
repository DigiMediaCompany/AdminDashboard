import { getApi } from "../../../services/adminArticleService.ts";
import BaseTable from "../BaseTable.tsx";
import ArticleSeriesItem from "../items/ArticleSeriesItem.tsx";
import {Series} from "../../../types/Article.ts";


export default function SeriesTable() {
    return (
        <>
            <BaseTable<Series>
                fetchData={(page) => getApi<Series>('series', page)}
                renderRows={(items) => <ArticleSeriesItem series={items} />}
                loadingText="Loading quizzes..."
                errorMessage="Failed to load quizzes."
            />

        </>
    );
}
