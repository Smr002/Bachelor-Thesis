import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash, Plus, Code, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { problems } from "@/data/problems";
import { toast } from "@/components/ui/use-toast";
import {
  createProblem,
  findAllProblem,
  updateProblem,
  deleteProblem,
} from "@/api";
import { Problem } from "@/types/problem";

export const QuestionsManager = () => {
  const [questionList, setQuestionList] = useState<Problem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Problem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newExample, setNewExample] = useState({
    input: "",
    output: "",
    explanation: "",
  });
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    if (!userToken) return;
    findAllProblem(userToken)
      .then((data) => {
        const normalized = data.map((q: any) => ({
          ...q,
          examples: q.Example ?? [],
          testCases: q.TestCase ?? [],
        }));
        setQuestionList(normalized);
      })
      .catch((err) => {
        toast({
          title: "Error fetching questions",
          description: err.message,
          variant: "destructive",
        });
      });
  }, [userToken]);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      title: "",
      difficulty: "easy",
      description: "",
      examples: [],
      constraints: [],
      completed: false,
      starterCode: "// Write your code here",
    } as Problem);
    setIsAddDialogOpen(true);
  };

  const handleEditQuestion = (question: Problem) => {
    setCurrentQuestion({ ...question });
    setIsEditDialogOpen(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!userToken) return;
    try {
      await deleteProblem(id, userToken);
      setQuestionList((prev) => prev.filter((q) => q.id !== id));
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting question",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveQuestion = async (isNew: boolean) => {
    if (!currentQuestion || !userToken) return;

    try {
      if (isNew) {
        const saved = await createProblem(currentQuestion, userToken);
        const normalized = {
          ...saved,
          examples: saved.Example ?? [],
          testCases: saved.TestCase ?? [],
        };
        setQuestionList((prev) => [...prev, normalized]);
        setIsAddDialogOpen(false);
        toast({
          title: "Question added",
          description:
            "The question has been successfully saved to the server.",
        });
      } else {
        await updateProblem(currentQuestion, userToken);
        setQuestionList((prev) =>
          prev.map((q) => (q.id === currentQuestion.id ? currentQuestion : q))
        );
        setIsEditDialogOpen(false);
        toast({
          title: "Question updated",
          description: "The question has been successfully updated.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error saving question",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExample = () => {
    if (newExample.input && newExample.output && currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        examples: [...currentQuestion.examples, newExample],
      });
      setNewExample({ input: "", output: "", explanation: "" });
    }
  };

  const handleRemoveExample = (index: number) => {
    if (!currentQuestion) return;
    const updatedExamples = [...currentQuestion.examples];
    updatedExamples.splice(index, 1);
    setCurrentQuestion({
      ...currentQuestion,
      examples: updatedExamples,
    });
  };

  const handleAddConstraint = () => {
    if (!currentQuestion) return;
    setCurrentQuestion({
      ...currentQuestion,
      constraints: [...currentQuestion.constraints, ""],
    });
  };

  const handleUpdateConstraint = (index: number, value: string) => {
    if (!currentQuestion) return;
    const updatedConstraints = [...currentQuestion.constraints];
    updatedConstraints[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      constraints: updatedConstraints,
    });
  };

  const handleRemoveConstraint = (index: number) => {
    if (!currentQuestion) return;
    const updatedConstraints = [...currentQuestion.constraints];
    updatedConstraints.splice(index, 1);
    setCurrentQuestion({
      ...currentQuestion,
      constraints: updatedConstraints,
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-leetcode-text-primary">
          Manage Questions
        </h2>
        <Button
          onClick={handleAddQuestion}
          className="bg-leetcode-green hover:bg-leetcode-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <Card className="bg-leetcode-bg-dark border-leetcode-bg-light overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-leetcode-text-secondary">
                  ID
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Title
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Difficulty
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Examples
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionList.map((question) => (
                <TableRow
                  key={question.id}
                  className="border-leetcode-bg-light"
                >
                  <TableCell className="text-leetcode-text-primary">
                    {question.id}
                  </TableCell>
                  <TableCell className="text-leetcode-text-primary font-medium">
                    {question.title}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        question.difficulty === "easy"
                          ? "bg-leetcode-green/20 text-leetcode-green"
                          : question.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-leetcode-red/20 text-leetcode-red"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="text-leetcode-text-primary">
                    {question.examples.length}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-leetcode-red border-leetcode-red hover:bg-leetcode-red/10"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-leetcode-text-primary">
              Add New Question
            </DialogTitle>
            <DialogDescription className="text-leetcode-text-secondary">
              Create a new programming question with examples and constraints.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={currentQuestion?.title || ""}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    title: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={currentQuestion?.difficulty || "easy"}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    difficulty: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border border-leetcode-bg-light rounded-md h-10 px-3 text-leetcode-text-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentQuestion?.description || ""}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    description: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Starter Code</Label>
              <div className="col-span-3">
                <Textarea
                  value={
                    currentQuestion?.starterCode || "// Write your code here"
                  }
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      starterCode: e.target.value,
                    })
                  }
                  className="w-full bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary font-mono min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2">
                <Label>Examples</Label>
                <p className="text-xs text-leetcode-text-secondary mt-1">
                  Add input/output examples
                </p>
              </div>
              <div className="col-span-3 space-y-4">
                {currentQuestion?.examples.map(
                  (example: any, index: number) => (
                    <Card
                      key={index}
                      className="bg-leetcode-bg-dark border-leetcode-bg-light"
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm text-leetcode-text-primary">
                            Example {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-leetcode-red hover:text-leetcode-red/90 hover:bg-transparent"
                            onClick={() => handleRemoveExample(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label
                              htmlFor={`input-${index}`}
                              className="text-xs"
                            >
                              Input
                            </Label>
                            <Input
                              id={`input-${index}`}
                              value={example.input}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`output-${index}`}
                              className="text-xs"
                            >
                              Output
                            </Label>
                            <Input
                              id={`output-${index}`}
                              value={example.output}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`explanation-${index}`}
                              className="text-xs"
                            >
                              Explanation
                            </Label>
                            <Input
                              id={`explanation-${index}`}
                              value={example.explanation || ""}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}

                <Card className="bg-leetcode-bg-dark border-leetcode-bg-light border-dashed">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm text-leetcode-text-primary">
                      Add New Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="new-input" className="text-xs">
                          Input
                        </Label>
                        <Input
                          id="new-input"
                          value={newExample.input}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              input: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., nums = [1,2,3]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-output" className="text-xs">
                          Output
                        </Label>
                        <Input
                          id="new-output"
                          value={newExample.output}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              output: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., 6"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-explanation" className="text-xs">
                          Explanation (Optional)
                        </Label>
                        <Input
                          id="new-explanation"
                          value={newExample.explanation}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              explanation: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., Sum of all elements"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddExample}
                      className="ml-auto text-leetcode-green border-leetcode-green hover:bg-leetcode-green/10"
                      disabled={!newExample.input || !newExample.output}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Example
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2">
                <Label>Constraints</Label>
                <p className="text-xs text-leetcode-text-secondary mt-1">
                  Add problem constraints
                </p>
              </div>
              <div className="col-span-3 space-y-2">
                {currentQuestion?.constraints.map(
                  (constraint: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={constraint}
                        onChange={(e) =>
                          handleUpdateConstraint(index, e.target.value)
                        }
                        className="bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
                        placeholder="e.g., 1 <= nums.length <= 100"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-leetcode-red hover:text-leetcode-red/90 hover:bg-transparent"
                        onClick={() => handleRemoveConstraint(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddConstraint}
                  className="text-leetcode-blue border-leetcode-blue hover:bg-leetcode-blue/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Constraint
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-leetcode-bg-light text-leetcode-text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveQuestion(true)}
              className="bg-leetcode-green hover:bg-leetcode-green/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog - Similar to Add but with pre-filled data */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-leetcode-text-primary">
              Edit Question
            </DialogTitle>
            <DialogDescription className="text-leetcode-text-secondary">
              Modify this programming question's details.
            </DialogDescription>
          </DialogHeader>

          {/* Same form fields as the Add dialog, but pre-filled with currentQuestion data */}
          <div className="grid gap-4 py-4">
            {/* Title field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={currentQuestion?.title || ""}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    title: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
              />
            </div>

            {/* Same fields as Add dialog... */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-difficulty" className="text-right">
                Difficulty
              </Label>
              <select
                id="edit-difficulty"
                value={currentQuestion?.difficulty || "Easy"}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    difficulty: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border border-leetcode-bg-light rounded-md h-10 px-3 text-leetcode-text-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={currentQuestion?.description || ""}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    description: e.target.value,
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Starter Code</Label>
              <div className="col-span-3">
                <Textarea
                  value={
                    currentQuestion?.starterCode || "// Write your code here"
                  }
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      starterCode: e.target.value,
                    })
                  }
                  className="w-full bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary font-mono min-h-[100px]"
                />
              </div>
            </div>

            {/* Examples section - same as in Add dialog */}
            <div className="grid grid-cols-4 items-start gap-4">
              {/* ... examples section same as Add dialog ... */}
              <div className="text-right pt-2">
                <Label>Examples</Label>
                <p className="text-xs text-leetcode-text-secondary mt-1">
                  Add input/output examples
                </p>
              </div>
              <div className="col-span-3 space-y-4">
                {currentQuestion?.examples.map(
                  (example: any, index: number) => (
                    <Card
                      key={index}
                      className="bg-leetcode-bg-dark border-leetcode-bg-light"
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm text-leetcode-text-primary">
                            Example {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-leetcode-red hover:text-leetcode-red/90 hover:bg-transparent"
                            onClick={() => handleRemoveExample(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label
                              htmlFor={`edit-input-${index}`}
                              className="text-xs"
                            >
                              Input
                            </Label>
                            <Input
                              id={`edit-input-${index}`}
                              value={example.input}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`edit-output-${index}`}
                              className="text-xs"
                            >
                              Output
                            </Label>
                            <Input
                              id={`edit-output-${index}`}
                              value={example.output}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`edit-explanation-${index}`}
                              className="text-xs"
                            >
                              Explanation
                            </Label>
                            <Input
                              id={`edit-explanation-${index}`}
                              value={example.explanation || ""}
                              readOnly
                              className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}

                <Card className="bg-leetcode-bg-dark border-leetcode-bg-light border-dashed">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm text-leetcode-text-primary">
                      Add New Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="edit-new-input" className="text-xs">
                          Input
                        </Label>
                        <Input
                          id="edit-new-input"
                          value={newExample.input}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              input: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., nums = [1,2,3]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-new-output" className="text-xs">
                          Output
                        </Label>
                        <Input
                          id="edit-new-output"
                          value={newExample.output}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              output: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., 6"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="edit-new-explanation"
                          className="text-xs"
                        >
                          Explanation (Optional)
                        </Label>
                        <Input
                          id="edit-new-explanation"
                          value={newExample.explanation}
                          onChange={(e) =>
                            setNewExample({
                              ...newExample,
                              explanation: e.target.value,
                            })
                          }
                          className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary text-xs mt-1"
                          placeholder="e.g., Sum of all elements"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddExample}
                      className="ml-auto text-leetcode-green border-leetcode-green hover:bg-leetcode-green/10"
                      disabled={!newExample.input || !newExample.output}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Example
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Constraints section - same as in Add dialog */}
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2">
                <Label>Constraints</Label>
                <p className="text-xs text-leetcode-text-secondary mt-1">
                  Add problem constraints
                </p>
              </div>
              <div className="col-span-3 space-y-2">
                {currentQuestion?.constraints.map(
                  (constraint: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={constraint}
                        onChange={(e) =>
                          handleUpdateConstraint(index, e.target.value)
                        }
                        className="bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
                        placeholder="e.g., 1 <= nums.length <= 100"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-leetcode-red hover:text-leetcode-red/90 hover:bg-transparent"
                        onClick={() => handleRemoveConstraint(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddConstraint}
                  className="text-leetcode-blue border-leetcode-blue hover:bg-leetcode-blue/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Constraint
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-leetcode-bg-light text-leetcode-text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveQuestion(false)}
              className="bg-leetcode-green hover:bg-leetcode-green/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
