import {Series} from "../../../types/Article";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface ArticleSeriesItemProps {
    series: Series[];
}

export default function ArticleSeriesItem({ series }: ArticleSeriesItemProps) {
    return (
        <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Name
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Category
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Series context
                    </TableCell>
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {series.map((s) => (
                    <TableRow key={s.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {s.name || "—"}
                        </TableCell>


                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

