import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash, Code, PenLine, X, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const mockQuizzes = [
  { 
    id: 1, 
    title: 'JavaScript Basics', 
    description: 'Test your knowledge of fundamental JavaScript concepts',
    questionCount: 5,
    created: '2023-08-15',
    questions: [
      {
        id: 1,
        question: 'What is a closure in JavaScript?',
        code: 'function outer() {\n  var x = 10;\n  function inner() {\n    console.log(x);\n  }\n  return inner;\n}',
        options: [
          'A way to close a browser window',
          'A function that has access to its outer function\'s scope',
          'A method to close an open connection',
          'A way to protect variables from being accessed'
        ],
        correctAnswer: 1,
        explanation: 'A closure is a function that has access to its outer function\'s scope even after the outer function has returned.'
      },
      {
        id: 2,
        question: 'What does "this" refer to in JavaScript?',
        code: '',
        options: [
          'It refers to the current function',
          'It refers to the global object',
          'It depends on how the function is called',
          'It refers to the parent object'
        ],
        correctAnswer: 2,
        explanation: 'The value of "this" depends on how the function is called. In a method, it refers to the owner object. Alone, it refers to the global object.'
      }
    ]
  },
  { 
    id: 2, 
    title: 'Advanced React', 
    description: 'A quiz on advanced React concepts and patterns',
    questionCount: 8,
    created: '2023-09-22',
    questions: [
      {
        id: 1,
        question: 'What is React Context API used for?',
        code: '',
        options: [
          'To replace Redux completely',
          'To share state across components without prop drilling',
          'To create global CSS variables',
          'To connect to external APIs'
        ],
        correctAnswer: 1,
        explanation: 'Context provides a way to pass data through the component tree without having to pass props down manually at every level.'
      }
    ]
  }
];

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
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [activeTab, setActiveTab] = useState('list');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: 1,
    question: '',
    code: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  
  const handleEditQuiz = (quizId: number) => {
    const quizToEdit = quizzes.find(q => q.id === quizId);
    
    if (quizToEdit) {
      setQuizTitle(quizToEdit.title);
      setQuizDescription(quizToEdit.description);
      setQuestions(quizToEdit.questions);
      setEditingQuizId(quizId);
      
      if (quizToEdit.questions.length > 0) {
        setCurrentQuestion(quizToEdit.questions[0]);
        setCurrentQuestionIndex(0);
      }
      
      setActiveTab('create');
      
      toast({
        title: "Editing quiz",
        description: `Now editing "${quizToEdit.title}"`,
      });
    }
  };
  
  const handleAddQuiz = () => {
    if (!quizTitle) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the quiz.",
        variant: "destructive",
      });
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question to the quiz.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingQuizId !== null) {
      const updatedQuizzes = quizzes.map(quiz => {
        if (quiz.id === editingQuizId) {
          return {
            ...quiz,
            title: quizTitle,
            description: quizDescription,
            questionCount: questions.length,
            questions: questions
          };
        }
        return quiz;
      });
      
      setQuizzes(updatedQuizzes);
      
      toast({
        title: "Quiz updated",
        description: "The quiz has been successfully updated.",
      });
    } else {
      const id = Math.max(...quizzes.map(q => q.id), 0) + 1;
      const today = new Date().toISOString().split('T')[0];
      
      setQuizzes([...quizzes, {
        id,
        title: quizTitle,
        description: quizDescription,
        questionCount: questions.length,
        created: today,
        questions: questions
      }]);
      
      toast({
        title: "Quiz created",
        description: "The quiz has been successfully created.",
      });
    }
    
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentQuestion({
      id: 1,
      question: '',
      code: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setEditingQuizId(null);
    
    setActiveTab('list');
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
    
    if (currentQuestion.options.some(opt => !opt)) {
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
      setQuestions([...questions, { ...currentQuestion, id: questions.length + 1 }]);
      
      toast({
        title: "Question added",
        description: "The question has been successfully added to the quiz.",
      });
    }
    
    setCurrentQuestion({
      id: questions.length + 2,
      question: '',
      code: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    
    setCurrentQuestionIndex(questions.length + 1);
  };
  
  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setCurrentQuestionIndex(index);
  };
  
  const handleDeleteQuestion = (index: number) => {
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
  
  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };
  
  const handleDeleteQuiz = (id: number) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    
    toast({
      title: "Quiz deleted",
      description: "The quiz has been successfully deleted.",
    });
  };

  const handleCancelEdit = () => {
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentQuestion({
      id: 1,
      question: '',
      code: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setEditingQuizId(null);
    
    setActiveTab('list');
    
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-leetcode-text-primary">Manage Quizzes</h2>
          <TabsList className="bg-leetcode-bg-dark border border-leetcode-bg-light h-auto p-1">
            <TabsTrigger 
              value="list"
              className="data-[state=active]:bg-leetcode-blue data-[state=active]:text-white py-1 px-3"
              onClick={() => setActiveTab('list')}
            >
              <List className="h-4 w-4 mr-2" />
              <span>Quiz List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="create"
              className="data-[state=active]:bg-leetcode-green data-[state=active]:text-white py-1 px-3"
              onClick={() => setActiveTab('create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>{editingQuizId !== null ? 'Edit Quiz' : 'Create Quiz'}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="m-0">
          <Card className="bg-leetcode-bg-dark border-leetcode-bg-light overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-leetcode-text-primary">Available Quizzes</CardTitle>
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
                    onClick={() => setActiveTab('create')}
                    className="text-leetcode-blue mt-2"
                  >
                    Create your first quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="bg-leetcode-bg-medium border-leetcode-bg-light">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-leetcode-text-primary">{quiz.title}</CardTitle>
                            <CardDescription className="text-leetcode-text-secondary">
                              Created: {quiz.created} | Questions: {quiz.questionCount}
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
                        <p className="text-leetcode-text-primary">{quiz.description}</p>
                      </CardContent>
                      <CardFooter className="pt-2 pb-4">
                        <Button variant="outline" size="sm" className="text-leetcode-text-primary">
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
                    {editingQuizId !== null ? 'Edit Quiz' : 'Quiz Details'}
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
                      placeholder="e.g., JavaScript Fundamentals"
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
                    className={`${editingQuizId !== null ? 'w-auto' : 'w-full'} bg-leetcode-green hover:bg-leetcode-green/90`}
                    disabled={!quizTitle || questions.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingQuizId !== null ? 'Update Quiz' : 'Save Quiz'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-leetcode-bg-dark border-leetcode-bg-light">
                <CardHeader>
                  <CardTitle className="text-lg text-leetcode-text-primary">Questions ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-4 text-leetcode-text-secondary">
                      <p>No questions added yet.</p>
                      <p className="text-xs mt-1">Use the form on the right to add questions.</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {questions.map((q, index) => (
                        <li key={index} className="flex justify-between items-center p-2 rounded bg-leetcode-bg-medium border border-leetcode-bg-light">
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
                        onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                        className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary"
                        placeholder="Enter your question here..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="code-snippet">Code Snippet (Optional)</Label>
                        <Code className="h-4 w-4 text-leetcode-blue" />
                      </div>
                      <Textarea 
                        id="code-snippet" 
                        value={currentQuestion.code || ''}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, code: e.target.value})}
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
                            <RadioGroup value={currentQuestion.correctAnswer.toString()}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={index.toString()} 
                                  id={`option-${index}`}
                                  onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                                  className="text-leetcode-blue"
                                />
                              </div>
                            </RadioGroup>
                            <Input 
                              value={option}
                              onChange={(e) => handleUpdateOption(index, e.target.value)}
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
                        onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
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
                        
                        <RadioGroup value={currentQuestion.correctAnswer.toString()} className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <div 
                              key={index}
                              className={`flex items-center space-x-2 p-3 rounded-md
                                ${index === currentQuestion.correctAnswer 
                                  ? 'border-2 border-leetcode-green' 
                                  : 'border border-leetcode-bg-light'
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
                                <div className="h-5 w-5 text-leetcode-green">✓</div>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {currentQuestion.explanation && (
                          <div className="mt-6 p-3 bg-leetcode-blue/10 border border-leetcode-blue/30 rounded-md">
                            <h4 className="text-sm font-medium text-leetcode-blue mb-1">Explanation:</h4>
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
