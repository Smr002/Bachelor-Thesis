
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronRight, ChevronLeft, Code, Brain, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does the following code return?",
    code: `function mystery(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
mystery([1, 2, 3, 4, 5]);`,
    options: ["3", "15", "TypeError", "undefined"],
    correctAnswer: 0,
    explanation: "This function calculates the average of an array. It sums all elements using reduce and divides by the length."
  },
  {
    id: 2,
    question: "What will be logged to the console?",
    code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Success!"), 1000);
});

promise.then(result => console.log(result));
console.log("End");`,
    options: ["Success! then End", "End then Success!", "End only", "Success! only"],
    correctAnswer: 1,
    explanation: "JavaScript promises are asynchronous. The 'End' will be logged first, then after the timeout completes, 'Success!' will be logged."
  },
  {
    id: 3,
    question: "What does the following code output?",
    code: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount());`,
    options: ["0", "1", "2", "undefined"],
    correctAnswer: 2,
    explanation: "This is a closure example. The function createCounter returns an object with methods that have access to the count variable. After calling increment twice, count becomes 2."
  },
  {
    id: 4,
    question: "Which array method would you use to transform each element in an array?",
    options: ["filter()", "map()", "reduce()", "forEach()"],
    correctAnswer: 1,
    explanation: "The map() method creates a new array with the results of calling a provided function on every element in the calling array."
  },
  {
    id: 5,
    question: "What will the following code output?",
    code: `const obj = { a: 1, b: 2 };
const { a, c = 3 } = obj;
console.log(a, c);`,
    options: ["1, undefined", "1, 3", "undefined, 3", "Error"],
    correctAnswer: 1,
    explanation: "This uses object destructuring with a default value. Since 'c' doesn't exist in the object, it gets the default value of 3."
  }
];

const PopQuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [compilerCode, setCompilerCode] = useState('// Write your JavaScript code here\n\nfunction example() {\n  return "Hello, world!";\n}\n\nconsole.log(example());');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (!answered) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Select an option",
        description: "Please select an answer before checking.",
        variant: "destructive",
      });
      return;
    }

    setAnswered(true);
    
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: quizQuestions[currentQuestion].explanation,
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: quizQuestions[currentQuestion].explanation,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setCompilerOutput('');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setCompilerOutput('Running...');
    
    setTimeout(() => {
      try {
        // Create a safe execution context with console.log capture
        const logs: string[] = [];
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        
        // Execute the code
        new Function(compilerCode)();
        
        // Restore original console.log
        console.log = originalConsoleLog;
        
        setCompilerOutput(logs.join('\n'));
      } catch (error) {
        setCompilerOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const questionVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.3 } }
  };

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
          <h1 className="text-3xl font-bold text-leetcode-text-primary">Coding Pop Quiz</h1>
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
              <RadioGroup value={selectedOption?.toString()} className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer transition-colors
                      ${selectedOption === index 
                        ? 'bg-leetcode-bg-light' 
                        : 'hover:bg-leetcode-bg-light/50'
                      }
                      ${answered && index === quizQuestions[currentQuestion].correctAnswer
                        ? 'border-2 border-leetcode-green'
                        : answered && index === selectedOption && selectedOption !== quizQuestions[currentQuestion].correctAnswer
                          ? 'border-2 border-leetcode-red'
                          : 'border border-leetcode-bg-light'
                      }
                    `}
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
                    {answered && index === quizQuestions[currentQuestion].correctAnswer && (
                      <Check className="h-5 w-5 text-leetcode-green" />
                    )}
                    {answered && index === selectedOption && selectedOption !== quizQuestions[currentQuestion].correctAnswer && (
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
              <CardTitle className="text-2xl text-leetcode-text-primary">Quiz Completed!</CardTitle>
              <CardDescription className="text-xl text-leetcode-text-primary mt-4">
                Your final score:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-6 text-leetcode-blue">{score}/{quizQuestions.length}</div>
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
                    JavaScript Compiler
                  </CardTitle>
                  <Code className="h-5 w-5 text-leetcode-blue" />
                </div>
                <CardDescription className="text-leetcode-text-primary mt-2">
                  Try out your JavaScript skills with this live code editor!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-leetcode-bg-dark rounded-md overflow-hidden">
                  <Textarea
                    value={compilerCode}
                    onChange={(e) => setCompilerCode(e.target.value)}
                    className="w-full p-4 bg-leetcode-bg-dark text-leetcode-text-primary font-mono resize-none min-h-[200px] border-none focus-visible:ring-0"
                    placeholder="// Write your JavaScript code here"
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
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="bg-leetcode-bg-dark rounded-md p-4 overflow-x-auto"
                  >
                    <h3 className="text-sm font-medium mb-2 text-leetcode-text-secondary">Output:</h3>
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
