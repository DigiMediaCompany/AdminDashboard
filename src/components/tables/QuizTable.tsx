import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import {Quiz} from "../../types/PostFunny.ts";
import {useEffect, useState} from "react";
import {getQuizzes} from "../../services/postFunnyService.ts";

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuizzes()
        .then(result => setQuizzes(result.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading quizzes...</p>
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Team
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Budget
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {quizzes.map((quiz: Quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    {/*<div className="w-10 h-10 overflow-hidden rounded-full">*/}
                    {/*  <img*/}
                    {/*    width={40}*/}
                    {/*    height={40}*/}
                    {/*    src={quiz.createdBy.img}*/}
                    {/*    alt={quiz.createdBy.name}*/}
                    {/*  />*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">*/}
                    {/*    {quiz.createdBy.name}*/}
                    {/*  </span>*/}
                    {/*  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">*/}
                    {/*    {quiz.createdBy.name}*/}
                    {/*  </span>*/}
                    {/*</div>*/}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {quiz.title}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {quiz.quizzes.map((teamImage, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                      >
                        {teamImage.img ?(<img
                          width={24}
                          height={24}
                          src={teamImage.img}
                          alt={`Team member ${index + 1}`}
                          className="w-full size-6"
                        />
                        ): null}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      quiz.createdAt === "Active"
                        ? "success"
                        : quiz.createdAt === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {quiz.createdAt}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {quiz.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
