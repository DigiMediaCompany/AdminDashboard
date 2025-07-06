import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "./pagination"

type Props = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function QuizPagination({ currentPage, totalPages, onPageChange }: Props) {
    const MAX_VISIBLE = 5 // Number of page buttons to show

    function getPageNumbers() {
        const pages: (number | string)[] = []

        if (totalPages <= MAX_VISIBLE + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            pages.push(1)

            if (start > 2) pages.push("...")

            for (let i = start; i <= end; i++) pages.push(i)

            if (end < totalPages - 1) pages.push("...")

            pages.push(totalPages)
        }

        return pages
    }

    return (
        <Pagination>
            <PaginationContent className="flex flex-wrap justify-center gap-1">
                <PaginationItem>
                    <PaginationLink
                        href=""
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        isActive={false}
                    >
                        Prev
                    </PaginationLink>
                </PaginationItem>

                {getPageNumbers().map((page, i) => (
                    <PaginationItem key={i}>
                        {typeof page === "number" ? (
                            <PaginationLink
                                href=""
                                onClick={() => onPageChange(page)}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        ) : (
                            <span className="px-2 py-1 text-gray-500">...</span>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        href=""
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        isActive={false}
                    >
                        Next
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
