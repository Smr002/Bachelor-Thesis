import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Code,
  Brain,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getAllQuizzes, submitQuiz } from "@/api";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const questionVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface SubmissionEntry {
  questionId: number;
  selectedOption: string;
  correctOption: string;
}

const PopQuizPage = () => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [compilerCode, setCompilerCode] = useState(
    '// Write your Java code here\n\nfunction example() {\n  return "Hello, world!";\n}\n\nconsole.log(example());'
  );
  const [compilerOutput, setCompilerOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const quizzes = await getAllQuizzes(token);
        if (Array.isArray(quizzes) && quizzes.length > 0) {
          // pick a random quiz
          const randomQuiz =
            quizzes[Math.floor(Math.random() * quizzes.length)];
          // map quiz questions to the shape we need
          const mapped: QuizQuestion[] = randomQuiz.questions.map((q: any) => ({
            id: q.id,
            question: q.questionText,
            code: q.code || "",
            options: [q.optionA, q.optionB, q.optionC, q.optionD],
            correctAnswer: ["A", "B", "C", "D"].indexOf(q.correctOption),
            explanation: q.explanation || "",
          }));
          setQuizQuestions(mapped.sort(() => Math.random() - 0.5));
        }

        console.log("Fetched quizzes:", quizzes);
      } catch (error: any) {
        toast({
          title: "Error fetching quiz",
          description: error.message || "Failed to fetch quizzes.",
          variant: "destructive",
        });
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (index: number) => {
    if (!answered) setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Select an option",
        description: "Choose an answer first.",
        variant: "destructive",
      });
      return;
    }
    setAnswered(true);
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        description: question.explanation,
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: question.explanation,
        variant: "destructive",
      });
    }
    setSubmissions((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedOption: question.options[selectedOption],
        correctOption: question.options[question.correctAnswer],
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const userId = 1; // replace with actual user
      if (submissions.length !== quizQuestions.length) {
        toast({
          title: "Incomplete Quiz",
          description: "Answer all questions.",
          variant: "destructive",
        });
        return;
      }
      const quizId = quizQuestions[0].id;
      await submitQuiz(userId, quizId, submissions, token);
      toast({
        title: "Quiz Submitted",
        description: "Results saved.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit.",
        variant: "destructive",
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setSubmissions([]);
    setCompilerOutput("");
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setCompilerOutput("Running...");
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const orig = console.log;
        console.log = (...args) => logs.push(args.join(" "));
        new Function(compilerCode)();
        console.log = orig;
        setCompilerOutput(logs.join("\n"));
      } catch (err: any) {
        setCompilerOutput(`Error: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  if (!quizQuestions.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading quiz...
      </div>
    );
  }
  return (
    <motion.div
      className="container max-w-4xl mx-auto py-10 px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-leetcode-blue mr-3" />
          <h1 className="text-3xl font-bold text-leetcode-text-primary">
            Coding Pop Quiz
          </h1>
        </div>
        <div className="text-lg font-medium text-leetcode-text-primary">
          Score: {score}/{quizQuestions.length}
        </div>
      </div>
      {!quizCompleted ? (
        <motion.div
          key={currentQuestion}
          variants={questionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card className="bg-leetcode-bg-medium border-leetcode-bg-light">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-leetcode-text-primary">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </CardTitle>
                {quizQuestions[currentQuestion].code && (
                  <Code className="h-5 w-5 text-leetcode-blue" />
                )}
              </div>
              <CardDescription className="text-lg text-leetcode-text-primary mt-2">
                {quizQuestions[currentQuestion].question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quizQuestions[currentQuestion].code && (
                <div className="bg-leetcode-bg-dark rounded-md p-4 overflow-x-auto my-4">
                  <pre className="text-sm text-leetcode-text-primary">
                    <code>{quizQuestions[currentQuestion].code}</code>
                  </pre>
                </div>
              )}
              <RadioGroup
                value={selectedOption?.toString()}
                className="space-y-3"
              >
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer transition-colors
                      ${
                        selectedOption === index
                          ? "bg-leetcode-bg-light"
                          : "hover:bg-leetcode-bg-light/50"
                      }
                      ${
                        answered &&
                        index === quizQuestions[currentQuestion].correctAnswer
                          ? "border-2 border-leetcode-green"
                          : answered &&
                            index === selectedOption &&
                            selectedOption !==
                              quizQuestions[currentQuestion].correctAnswer
                          ? "border-2 border-leetcode-red"
                          : "border border-leetcode-bg-light"
                      }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      disabled={answered}
                      className="text-leetcode-blue"
                    />
                    <label
                      htmlFor={`option-${index}`}
                      className="flex-grow text-leetcode-text-primary cursor-pointer"
                    >
                      {option}
                    </label>
                    {answered &&
                      index ===
                        quizQuestions[currentQuestion].correctAnswer && (
                        <Check className="h-5 w-5 text-leetcode-green" />
                      )}
                    {answered &&
                      index === selectedOption &&
                      selectedOption !==
                        quizQuestions[currentQuestion].correctAnswer && (
                        <X className="h-5 w-5 text-leetcode-red" />
                      )}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div>
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="text-leetcode-text-secondary border-leetcode-bg-light"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </div>
              <div className="flex gap-3">
                {!answered ? (
                  <Button
                    onClick={handleCheckAnswer}
                    className="bg-leetcode-blue hover:bg-leetcode-blue/90"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-leetcode-green hover:bg-leetcode-green/90"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      "Finish Quiz"
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-leetcode-bg-medium border-leetcode-bg-light text-center p-6">
            <CardHeader>
              <CardTitle className="text-2xl text-leetcode-text-primary">
                Quiz Completed!
              </CardTitle>
              <CardDescription className="text-xl text-leetcode-text-primary mt-4">
                Your final score:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-6 text-leetcode-blue">
                {score}/{quizQuestions.length}
              </div>
              <div className="text-lg mb-6 text-leetcode-text-primary">
                {score === quizQuestions.length
                  ? "Perfect! You're a coding genius!"
                  : score >= quizQuestions.length * 0.7
                  ? "Great job! You know your stuff."
                  : "Keep practicing! You're on the right track."}
              </div>
              <Button
                onClick={handleRestartQuiz}
                className="bg-leetcode-blue hover:bg-leetcode-blue/90 text-white px-6 py-2 text-lg"
              >
                Restart Quiz
              </Button>
              <Button
                onClick={handleSubmitQuiz}
                className="bg-leetcode-green hover:bg-leetcode-green/90 text-white px-6 py-2 text-lg mt-4"
              >
                Submit Quiz
              </Button>
            </CardContent>
          </Card>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-leetcode-bg-medium border-leetcode-bg-light">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-leetcode-text-primary">
                    Java Compiler
                  </CardTitle>
                  <Code className="h-5 w-5 text-leetcode-blue" />
                </div>
                <CardDescription className="text-leetcode-text-primary mt-2">
                  Try out your Java skills with this live code editor!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-leetcode-bg-dark rounded-md overflow-hidden">
                  <Textarea
                    value={compilerCode}
                    onChange={(e) => setCompilerCode(e.target.value)}
                    className="w-full p-4 bg-leetcode-bg-dark text-leetcode-text-primary font-mono resize-none min-h-[200px] border-none focus-visible:ring-0"
                    placeholder="// Write your Java code here"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-leetcode-green hover:bg-leetcode-green/90"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Code
                  </Button>
                </div>
                {compilerOutput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="bg-leetcode-bg-dark rounded-md p-4 overflow-x-auto"
                  >
                    <h3 className="text-sm font-medium mb-2 text-leetcode-text-secondary">
                      Output:
                    </h3>
                    <pre className="text-sm text-leetcode-text-primary whitespace-pre-wrap">
                      {compilerOutput}
                    </pre>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PopQuizPage;
