import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Trash, Code, PenLine, X, List, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
} from "@/api";

interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  created: string;
  questions: QuizQuestion[];
}

export const QuizCreator = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState("list");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: 1,
    question: "",
    code: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getAllQuizzes(token);
        setQuizzes(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch quizzes",
          variant: "destructive",
        });
      }
    };
    fetchQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      if (!quizTitle || questions.length === 0) {
        toast({
          title: "Missing Fields",
          description: "Quiz title and at least one question are required.",
          variant: "destructive",
        });
        return;
      }

      const quizPayload = {
        title: quizTitle,
        description: quizDescription,
        questions: questions.map((q) => ({
          id: q.id,
          questionText: q.question,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2],
          optionD: q.options[3],
          correctOption: ["A", "B", "C", "D"][q.correctAnswer],
          explanation: q.explanation,
          code: q.code,
        })),
        createdById: 1,
        deletedQuestionIds,
      };

      if (editingQuizId !== null) {
        await updateQuiz(editingQuizId, quizPayload, token);
        setDeletedQuestionIds([]);
        toast({
          title: "Quiz Updated",
          description: "Successfully updated the quiz.",
        });
      } else {
        await createQuiz(quizPayload, token);
        toast({
          title: "Quiz Created",
          description: "Successfully created the quiz.",
        });
      }

      const updated = await getAllQuizzes(token);
      setQuizzes(updated);
      resetForm();
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const questionToDelete = questions[index];

    if (questionToDelete.id && editingQuizId !== null) {
      setDeletedQuestionIds((prev) => [...prev, questionToDelete.id]);
    }

    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);

    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, updatedQuestions.length - 1));
    }

    toast({
      title: "Question removed",
      description: "The question has been removed from the quiz.",
    });
  };

  const handleDeleteQuiz = async (id: number) => {
    const token = localStorage.getItem("token") || "";
    try {
      await deleteQuiz(id, token);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      toast({ title: "Deleted", description: "Quiz has been deleted." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentQuestion({
      id: 1,
      question: "",
      code: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
    setEditingQuizId(null);
  };

  const handleEditQuiz = async (id: number) => {
    const token = localStorage.getItem("token") || "";
    try {
      const quiz = await getQuizById(id, token);

      const formattedQuestions = quiz.questions.map((q: any) => ({
        id: q.id,
        question: q.questionText,
        code: q.codeSnippet,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: ["A", "B", "C", "D"].indexOf(q.correctOption),
        explanation: q.explanation,
      }));
      setEditingQuizId(quiz.id);
      setQuizTitle(quiz.title);
      setQuizDescription(quiz.description);
      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(
        formattedQuestions[0] ||
          {
            /* default object */
          }
      );
      setActiveTab("create");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load quiz for editing.",
        variant: "destructive",
      });
    }
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion.question) {
      toast({
        title: "Missing question",
        description: "Please provide the question text.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion.options.some((opt) => !opt)) {
      toast({
        title: "Incomplete options",
        description: "Please fill in all answer options.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < questions.length) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      setQuestions(updatedQuestions);

      toast({
        title: "Question updated",
        description: "The question has been successfully updated.",
      });
    } else {
      setQuestions([
        ...questions,
        { ...currentQuestion, id: questions.length + 1 },
      ]);

      toast({
        title: "Question added",
        description: "The question has been successfully added to the quiz.",
      });
    }

    setCurrentQuestion({
      id: questions.length + 2,
      question: "",
      code: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });

    setCurrentQuestionIndex(questions.length + 1);
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setCurrentQuestionIndex(index);
  };

  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab("list");

    toast({
      title: "Edit cancelled",
      description: "Changes were discarded.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-leetcode-text-primary">
            Manage Quizzes
          </h2>
          <TabsList className="bg-leetcode-bg-dark border border-leetcode-bg-light h-auto p-1">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-leetcode-blue data-[state=active]:text-white py-1 px-3"
              onClick={() => setActiveTab("list")}
            >
              <List className="h-4 w-4 mr-2" />
              <span>Quiz List</span>
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-leetcode-green data-[state=active]:text-white py-1 px-3"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>
                {editingQuizId !== null ? "Edit Quiz" : "Create Quiz"}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="m-0">
          <Card className="bg-leetcode-bg-dark border-leetcode-bg-light overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-leetcode-text-primary">
                Available Quizzes
              </CardTitle>
              <CardDescription className="text-leetcode-text-secondary">
                Manage your existing quizzes or create a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <div className="text-center py-10 text-leetcode-text-secondary">
                  <p>No quizzes available.</p>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("create")}
                    className="text-leetcode-blue mt-2"
                  >
                    Create your first quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="bg-leetcode-bg-medium border-leetcode-bg-light"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-leetcode-text-primary">
                              {quiz.title}
                            </CardTitle>
                            <CardDescription className="text-leetcode-text-secondary">
                              Created: {quiz.created} | Questions:{" "}
                              {quiz.questionCount}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-leetcode-blue border-leetcode-blue hover:bg-leetcode-blue/10"
                              onClick={() => handleEditQuiz(quiz.id)}
                            >
                              <PenLine className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-leetcode-red border-leetcode-red hover:bg-leetcode-red/10"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-leetcode-text-primary">
                          {quiz.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2 pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-leetcode-text-primary"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Quiz
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="m-0">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-leetcode-bg-dark border-leetcode-bg-light">
                <CardHeader>
                  <CardTitle className="text-lg text-leetcode-text-primary">
                    {editingQuizId !== null ? "Edit Quiz" : "Quiz Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                      placeholder="e.g., Java Fundamentals"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea
                      id="quiz-description"
                      value={quizDescription}
                      onChange={(e) => setQuizDescription(e.target.value)}
                      className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                      placeholder="Briefly describe what this quiz covers..."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {editingQuizId !== null && (
                    <Button
                      onClick={handleCancelEdit}
                      className="bg-leetcode-bg-medium text-leetcode-text-primary hover:bg-leetcode-bg-light"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleAddQuiz}
                    className={`${
                      editingQuizId !== null ? "w-auto" : "w-full"
                    } bg-leetcode-green hover:bg-leetcode-green/90`}
                    disabled={!quizTitle || questions.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingQuizId !== null ? "Update Quiz" : "Save Quiz"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-leetcode-bg-dark border-leetcode-bg-light">
                <CardHeader>
                  <CardTitle className="text-lg text-leetcode-text-primary">
                    Questions ({questions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-4 text-leetcode-text-secondary">
                      <p>No questions added yet.</p>
                      <p className="text-xs mt-1">
                        Use the form on the right to add questions.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {questions.map((q, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 rounded bg-leetcode-bg-medium border border-leetcode-bg-light"
                        >
                          <div className="flex-1 mr-4">
                            <p className="text-sm text-leetcode-text-primary truncate">
                              {index + 1}. {q.question}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-leetcode-blue hover:text-leetcode-blue/90"
                              onClick={() => handleEditQuestion(index)}
                            >
                              <PenLine className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-leetcode-red hover:text-leetcode-red/90"
                              onClick={() => handleDeleteQuestion(index)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card className="bg-leetcode-bg-dark border-leetcode-bg-light">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-leetcode-text-primary">
                      {currentQuestionIndex < questions.length
                        ? "Edit Question"
                        : "Add Question"}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-leetcode-blue border-leetcode-blue hover:bg-leetcode-blue/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showPreview ? "Edit" : "Preview"}
                    </Button>
                  </div>
                </CardHeader>

                {!showPreview ? (
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-text">Question</Label>
                      <Textarea
                        id="question-text"
                        value={currentQuestion.question}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            question: e.target.value,
                          })
                        }
                        className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="code-snippet">
                          Code Snippet (Optional)
                        </Label>
                        <Code className="h-4 w-4 text-leetcode-blue" />
                      </div>
                      <Textarea
                        id="code-snippet"
                        value={currentQuestion.code || ""}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            code: e.target.value,
                          })
                        }
                        className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary font-mono"
                        placeholder="function example() { ... }"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <RadioGroup
                              value={currentQuestion.correctAnswer.toString()}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={index.toString()}
                                  id={`option-${index}`}
                                  onClick={() =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      correctAnswer: index,
                                    })
                                  }
                                  className="text-leetcode-blue"
                                />
                              </div>
                            </RadioGroup>
                            <Input
                              value={option}
                              onChange={(e) =>
                                handleUpdateOption(index, e.target.value)
                              }
                              className="flex-1 bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-leetcode-text-secondary mt-1">
                        Select the radio button next to the correct answer.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="explanation">Explanation</Label>
                      <Textarea
                        id="explanation"
                        value={currentQuestion.explanation}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            explanation: e.target.value,
                          })
                        }
                        className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                        placeholder="Explain why the correct answer is right..."
                      />
                    </div>

                    <Button
                      onClick={handleSaveQuestion}
                      className="w-full mt-4 bg-leetcode-blue hover:bg-leetcode-blue/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {currentQuestionIndex < questions.length
                        ? "Update Question"
                        : "Add Question"}
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent className="pt-4">
                    <Card className="bg-leetcode-bg-medium border-leetcode-bg-light">
                      <CardHeader>
                        <CardTitle className="text-leetcode-text-primary text-base">
                          {currentQuestion.question || "Question Preview"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {currentQuestion.code && (
                          <div className="bg-leetcode-bg-dark rounded-md p-4 overflow-x-auto my-4">
                            <pre className="text-sm text-leetcode-text-primary">
                              <code>{currentQuestion.code}</code>
                            </pre>
                          </div>
                        )}

                        <RadioGroup
                          value={currentQuestion.correctAnswer.toString()}
                          className="space-y-3"
                        >
                          {currentQuestion.options.map((option, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-3 rounded-md
                                ${
                                  index === currentQuestion.correctAnswer
                                    ? "border-2 border-leetcode-green"
                                    : "border border-leetcode-bg-light"
                                }
                              `}
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`preview-option-${index}`}
                                disabled
                                className="text-leetcode-blue"
                              />
                              <label
                                htmlFor={`preview-option-${index}`}
                                className="flex-grow text-leetcode-text-primary cursor-pointer"
                              >
                                {option || `Option ${index + 1}`}
                              </label>
                              {index === currentQuestion.correctAnswer && (
                                <div className="h-5 w-5 text-leetcode-green">
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </RadioGroup>

                        {currentQuestion.explanation && (
                          <div className="mt-6 p-3 bg-leetcode-blue/10 border border-leetcode-blue/30 rounded-md">
                            <h4 className="text-sm font-medium text-leetcode-blue mb-1">
                              Explanation:
                            </h4>
                            <p className="text-sm text-leetcode-text-primary">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
