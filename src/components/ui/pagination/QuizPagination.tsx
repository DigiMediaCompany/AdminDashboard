'use client'

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
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        isActive={false}
                    >
                        Prev
                    </PaginationLink>
                </PaginationItem>

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            onClick={() => onPageChange(page)}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        href="#"
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
