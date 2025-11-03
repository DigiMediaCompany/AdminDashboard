import {Category} from "../../../types/Article";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface CategoriesItemProps {
    categories: Category[];
}

export default function CategoriesItem({ categories }: CategoriesItemProps) {
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
                        Description
                    </TableCell>
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {categories.map((s) => (
                    <TableRow key={s.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {s.name || "—"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {s.description || "—"}
                        </TableCell>


                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

