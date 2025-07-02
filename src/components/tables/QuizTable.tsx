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
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";

enum AnswerState {
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

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
                Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Thumbnail
              </TableCell>
              <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Title
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Questions
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Answers
              </TableCell>
              {/*<TableCell*/}
              {/*  isHeader*/}
              {/*  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"*/}
              {/*>*/}
              {/*  Actions*/}
              {/*</TableCell>*/}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {quizzes.map((quiz: Quiz) => {
              let answerState: AnswerState = AnswerState.ERROR;
              const results = quiz.answers;
              if (results && results.length > 0) {
                answerState = AnswerState.WARNING;
                let isPointingCorrectly = true;
                quiz.quizzes.forEach((q) => {
                  q.answers.forEach((a) => {
                    if (results.find(r => r.id === a.score)) {
                      isPointingCorrectly = false;
                    }
                  })
                });
                if (isPointingCorrectly) answerState = AnswerState.SUCCESS;
              }

              return (
              <TableRow key={quiz.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {quiz.id}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-20 overflow-hidden">
                      <img
                        src={quiz.img}
                        alt={quiz.title}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 w-25
                      truncate overflow-hidden whitespace-nowrap">
                        {quiz.createdBy}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {quiz.createdAt}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-60">
                  <div className="line-clamp-2 overflow-hidden text-ellipsis break-words">
                    {quiz.title}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {quiz.quizzes.map((question, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                      >
                        {question.img ?(<img
                          src={question.img}
                          alt={`Team member ${index + 1}`}
                          className="h-full w-full"
                          title={question.question}
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
                      answerState === AnswerState.SUCCESS
                        ? "success"
                        : answerState === AnswerState.WARNING
                        ? "warning"
                        : "error"
                    }
                  >
                    {answerState}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm text-gray-300">
                      <PencilSquareIcon className="w-6 h-6" />
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-300">
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
