import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import {Answer, FileUploadResponse, Quiz} from "../../types/PostFunny.ts";
import {useEffect, useState} from "react";
import {deleteImage, getQuizzes, saveQuiz, uploadImage} from "../../services/postFunnyService.ts";
import {PencilSquareIcon, PlusCircleIcon, TrashIcon} from "@heroicons/react/24/outline";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import {useModal} from "../../hooks/useModal.ts";
import TextArea from "../form/input/TextArea.tsx";
import FileInput from "../form/input/FileInput.tsx";
import Alert from "../ui/alert/Alert.tsx";
import Toast from "../../pages/UiElements/Toast.tsx";
import Select from "../form/Select.tsx";

enum AnswerState {
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export default function QuizTable() {
  const BASE_URL_R2 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_R2_URL;
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({
    show: false,
    variant: "success",
    title: "",
    message: ""
  });

  useEffect(() => {
    getQuizzes()
        .then(result => {
          setQuizzes(result.data);
        })
        .catch(() => {
          setToast({
            show: true,
            variant: "error",
            title: "Error",
            message: 'Failed to load quizzes.'
          });
        })
        .finally(() => setLoading(false))
  }, [])

  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    if(selectedQuiz) {
      saveQuiz(selectedQuiz).then(() => {
        setToast({
          show: true,
          variant: "success",
          title: "Saved",
          message: "Quiz saved successfully."
        });
        setQuizzes(prev =>
            prev.map(q => (q.id === selectedQuiz.id ? selectedQuiz : q))
        );
      }).catch(() => {
        setToast({
          show: true,
          variant: "error",
          title: "Error",
          message: 'Failed to update quiz.'
        });
      })
    }
    closeModal();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file && selectedQuiz) {
      uploadImage(file).then((r: FileUploadResponse) => {
        const selectedAnswer = selectedQuiz.answers.find(a => a.id === id);
        if (selectedAnswer && selectedAnswer?.img && selectedAnswer?.img.trim() !== "") {
          // Delete old img if there's any
          const oldFileName = selectedAnswer.img.split("/").pop() || "";
          deleteImage(oldFileName).then(()=>{console.log("yay")}).catch(()=>{console.log("error")});
        }
        // Set img to selected quiz
        setSelectedQuiz(prev =>
            prev
                ? {
                  ...prev,
                  answers: prev.answers.map(ans =>
                      ans.id === id
                          ? { ...ans, img: `${BASE_URL_R2}/files/${r.filename}`}
                          : ans
                  )
                }
                : prev
        );
      }).catch(() => {
        setToast({
          show: true,
          variant: "error",
          title: "Error",
          message: 'Failed to upload image.'
        });
      })
    }
  };
  const handleAdd = () => {
    let answers = selectedQuiz?.answers
    const newId = Math.floor(100000 + Math.random() * 900000);
    const newAnswer: Answer = {
      id: newId,
      title: "",
      img: "",
      description: "",
    };
    if (answers && answers.length > 0) {
      answers = [...answers, newAnswer];
    } else {
      answers = [newAnswer];
    }
    setSelectedQuiz(prev =>
        prev
            ? {
              ...prev,
              answers: answers,
            }
            : null
    );
  }
  const handleSelectChange = (newScore: string, quizIndex: number, choiceIndex: number) => {
    if (selectedQuiz) {
      const updatedQuestions = selectedQuiz.quizzes.map((question, qIdx) => {
        if (qIdx !== quizIndex) return question;

        const updatedAnswers = question.answers.map((choice, cIdx) => {
          if (cIdx !== choiceIndex) return choice;
          return { ...choice, score: parseInt(newScore) };
        });

        return { ...question, answers: updatedAnswers };
      });

      setSelectedQuiz({
        ...selectedQuiz,
        quizzes: updatedQuestions,
      });
    }
  }

  if (loading) return <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Loading quizzes...</p>
  return (
    <>
      {toast.show && (
          <Toast
              variant={toast.variant}
              title={toast.title}
              message={toast.message}
              changeState={() => setToast({ show: false,
                variant: "success",
                title: "",
                message: ""
              })}
          />
      )}
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
                if (results && results.length > 1) {
                  answerState = AnswerState.WARNING;
                  let isPointingCorrectly = true;
                  quiz.quizzes.forEach((q) => {
                    q.answers.forEach((a) => {
                      if (!results.some(r => r.id === a.score)) {
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
                        // setSelectedQuiz(quizzes[index]);
                        // openModal();
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
                  <div className="mt-7" key={`${selectedQuiz}-${index}`}>
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
                            <Select
                                options={selectedQuiz.answers.map(a => ({
                                  value: a.id.toString(),
                                  label: a.title
                                }))}
                                defaultValue={selectedQuiz.answers.find((x) => x.id === choice.score) ? choice.score.toString() : ""}
                                placeholder="Select Result"
                                onChange={(change) => {handleSelectChange(change, index, i)}}
                                className={`col-span-3 lg:col-span-4${!selectedQuiz.answers.find(x => x.id === choice.score) ? " border-red-900" : ""}`}
                            />
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
                              <FileInput disabled={true}/>
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
                  <PlusCircleIcon className="w-6 h-6 text-gray-400" onClick={() => {handleAdd()}} />
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
                        <div className="col-span-3 lg:col-span-3 flex items-center justify-center h-full gap-x-2">
                          <TrashIcon className="w-6 h-6 text-gray-400" onClick={() => {
                            const updatedQuiz: Quiz = {
                              ...selectedQuiz,
                              answers: selectedQuiz.answers.filter(a => a.id !== answer.id),
                            };
                            setSelectedQuiz(updatedQuiz);
                          }} />
                          <Badge size="md" color={"light"}>
                            ID - {answer.id}
                          </Badge>
                        </div>
                        <div className="col-span-5 lg:col-span-13">
                          <Input
                              type="text"
                              value={answer.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;

                                setSelectedQuiz(prev =>
                                    prev
                                        ? {
                                          ...prev,
                                          answers: prev.answers.map(ans =>
                                              ans.id === answer.id
                                                  ? { ...ans, title: newTitle }
                                                  : ans
                                          )
                                        }
                                        : prev
                                );
                              }}
                          />
                        </div>
                        <div className="col-span-3 lg:col-span-6 h-auto flex items-center justify-center">
                          <div className="w-20  mr-1">
                            {answer.img?.trim() ? (
                                <img
                                    src={answer.img}
                                    alt={`Choice ${index + 1}`}
                                    className="h-10 text-gray-400"
                                />
                            ): (
                                <div className="h-full w-full bg-gray-800"></div>
                            )}
                          </div>
                          <FileInput
                              onChange={(e) => {
                                handleFileChange(e, answer.id)
                              }}
                          />
                        </div>
                        <div className="col-span-5 lg:col-span-10">
                          <TextArea
                              value={answer.description}
                              rows={4}
                              onChange={(newDescription) => {
                                setSelectedQuiz(prev =>
                                    prev
                                        ? {
                                          ...prev,
                                          answers: prev.answers.map(ans =>
                                              ans.id === answer.id
                                                  ? { ...ans, description: newDescription }
                                                  : ans
                                          )
                                        }
                                        : prev
                                );
                              }}
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
