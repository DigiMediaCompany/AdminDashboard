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
import {PencilSquareIcon, PlusCircleIcon, TrashIcon} from "@heroicons/react/24/outline";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import {useModal} from "../../hooks/useModal.ts";
import TextArea from "../form/input/TextArea.tsx";
import FileInput from "../form/input/FileInput.tsx";
import Alert from "../ui/alert/Alert.tsx";

enum AnswerState {
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  // TODO: need toast here
  useEffect(() => {
    getQuizzes()
        .then(result => setQuizzes(result.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
  }, [])

  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // TODO: Handle save logic here
    closeModal();
  };

  if (loading) return <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Loading quizzes...</p>
  return (
    <>
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
              {quizzes.map((quiz: Quiz, index) => {
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
                          {question.img?.trim() ?(<img
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
                      <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                        setSelectedQuiz(quizzes[index]);
                        openModal();
                      }}>
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-400" onClick={() => {
                        setSelectedQuiz(quizzes[index]);
                        openModal();
                      }}>
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
      <Modal isOpen={isOpen} onClose={closeModal} className="w-full m-4 lg:max-w-[900px]">
        <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Quiz
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Don't touch anything you are not aware
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Basic
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Id</Label>
                    <Input
                        type="text"
                        value={selectedQuiz?.id}
                        disabled={true}
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input type="text" value={selectedQuiz?.title} disabled={true} />
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input type="text" value={selectedQuiz?.createdAt} disabled={true} />
                  </div>

                  <div>
                    <Label>Author</Label>
                    <Input type="text" value={selectedQuiz?.createdBy} disabled={true} />
                  </div>

                  <div className="col-span-2">
                    <Label>Title</Label>
                    <TextArea
                        value={selectedQuiz?.title}
                        rows={3}
                        disabled={true}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Description</Label>
                    <TextArea
                        value={selectedQuiz?.description}
                        rows={3}
                        disabled={true}
                    />
                  </div>

                </div>
              </div>
              {selectedQuiz?.quizzes.map((quiz, index) => (
                  <div className="mt-7">
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Question {index + 1}
                    </h5>

                    <div className="grid grid-cols-8 gap-x-6 gap-y-5 lg:grid-cols-16">
                      <div className="col-span-14 lg:col-span-16">
                        <Input type="text" value={quiz.question} disabled={true} />
                      </div>
                      {quiz.answers.map((choice, i) => (
                          <>
                            <div className="col-span-1 lg:col-span-1 flex items-center h-full">
                              <Label>{i + 1}.</Label>
                            </div>
                            <div className="col-span-13 lg:col-span-15">
                              <Input type="text" value={choice.choice} disabled={true}/>
                            </div>
                            <div className="col-span-3 lg:col-span-4">
                              <Input type="text" value={choice.score} disabled={true}/>
                            </div>
                            <div className="col-span-11 lg:col-span-12 flex">
                              <div className="w-20 flex items-center justify-center mr-1">
                                {choice.img?.trim() ? (
                                    <img
                                        src={choice.img}
                                        alt={`Choice ${index + 1}`}
                                        className="h-10"
                                    />
                                ): (
                                    <div className="h-full w-full bg-gray-800"></div>
                                )}
                              </div>
                              <FileInput />
                            </div>
                          </>
                      ))}
                    </div>
                  </div>
              ))}
              <div className="mt-7">
                <div className="flex items-center gap-2 mb-5">
                  <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
                    Answers
                  </h5>
                  <button className="text-gray-400" onClick={() => {}}>
                    <PlusCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                {selectedQuiz?.answers && selectedQuiz?.answers.length > 1 ? (
                    // More than 1 result
                    <div></div>
                ) : selectedQuiz?.answers && selectedQuiz?.answers.length === 1 ? (
                    // Only 1 result
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 mb-7">
                      <div className="col-span-1">
                        <Alert
                            variant="warning"
                            title="Only one result"
                            message="Please add more result."
                        />
                      </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 mb-7">
                      <div className="col-span-1">
                        <Alert
                            variant="error"
                            title="No result"
                            message="Please add at least one result."
                        />
                      </div>
                    </div>
                )}



                <div className="grid grid-cols-8 gap-x-6 gap-y-5 lg:grid-cols-16">
                  {selectedQuiz?.answers.map((answer, index) => (
                      <>
                        <div className="col-span-2 lg:col-span-2 flex items-center justify-center h-full">
                          <Badge size="md" color={"light"}>
                            ID - {answer.id}
                          </Badge>
                        </div>
                        <div className="col-span-6 lg:col-span-14">
                          <Input type="text" value={answer.title} />
                        </div>
                        <div className="col-span-3 lg:col-span-6 h-auto flex items-center justify-center">
                          <div className="w-20  mr-1">
                            {answer.img?.trim() ? (
                                <img
                                    src={answer.img}
                                    alt={`Choice ${index + 1}`}
                                    className="h-10"
                                />
                            ): (
                                <div className="h-full w-full bg-gray-800"></div>
                            )}
                          </div>
                          <FileInput />
                        </div>
                        <div className="col-span-5 lg:col-span-10">
                          <TextArea
                              value={answer.description}
                              rows={4}
                          />
                        </div>
                      </>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
