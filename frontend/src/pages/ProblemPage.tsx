import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProblemDescription from "@/components/ProblemDescription";
import CodeEditor from "@/components/CodeEditor";
import Comments from "@/components/Comments";
import { Button } from "@/components/ui/button";
import { Problem } from "@/types/problem";
import {
  findAllProblem,
  findProblemById,
  runCode,
  createSubmission,
} from "@/api";
import { toast } from "sonner";

const ProblemPage = () => {
  const { id: problemId } = useParams(); // Rename id to problemId for clarity
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userToken || !problemId) {
          navigate("/problems");
          return;
        }

        // Fetch all problems for navigation
        const allProblems = await findAllProblem(userToken);
        setProblems(allProblems);

        // Fetch current problem details
        const data = await findProblemById(problemId, userToken);
        setProblem({
          ...data,
          examples: data.Example ?? [],
          difficulty: data.difficulty.toLowerCase(),
        });
      } catch (err: any) {
        toast.error("Error fetching problem", {
          description: err.message,
        });
        navigate("/problems");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [problemId, userToken, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-leetcode-bg-dark">
        <div className="text-leetcode-text-secondary">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-leetcode-bg-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
          <Button onClick={() => navigate("/problems")}>
            Go Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  const nextProblem = problems.find((p) => p.id > problem.id);
  const prevProblem = [...problems].reverse().find((p) => p.id < problem.id);

  const handleRunCode = async (code: string) => {
    if (!userToken || !problemId) {
      toast.error("Authentication required");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const response = await runCode(problemId, code, userToken);
      console.log("API Response:", response);

      // Check if response and testResults exist
      if (!response || !response.testResults) {
        toast.error("Code execution completed", {
          description: response?.message || "No test results returned",
        });
        return {
          success: false,
          message: "Execution did not return test results",
        };
      }

      const testResults = response.testResults;
      const allTestsPassed = testResults.every((test) => test.passed);

      if (allTestsPassed) {
        toast.success("Code execution completed", {
          description: `${testResults.length}/${testResults.length} tests passed`,
        });
        return { success: true, message: "Code executed successfully" };
      } else {
        const passedTests = testResults.filter((test) => test.passed).length;
        const failedTests = testResults.filter((test) => !test.passed);
        const firstErrorMessage = failedTests[0]?.output || "Some tests failed";

        toast.error("Code execution completed", {
          description: `${passedTests}/${testResults.length} test cases passed. Error: ${firstErrorMessage}`,
        });
        return { success: false, message: "Some tests failed" };
      }
    } catch (error: any) {
      console.error("Code execution error:", error);
      const errorMessage = error?.message || "Unknown error occurred";

      toast.error("Error running code", {
        description: errorMessage,
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  };

  const handleSubmitCode = async (code: string): Promise<boolean> => {
    if (!userToken || !problemId) {
      toast.error("Authentication required");
      return false;
    }

    try {
      // Run the code to test it
      const testResponse = await runCode(problemId!, code, userToken);
      console.log("Test response:", testResponse);

      if (!testResponse || !testResponse.testResults) {
        toast.error("Code execution failed", {
          description: testResponse?.message || "Unexpected result",
        });
        return false;
      }

      const testResults = testResponse.testResults;
      const isCorrect = testResults.every((test) => test.passed);

      // Prepare submission data
      const submissionData = {
        userId: parseInt(localStorage.getItem("userId") || "0"), // Assuming userId is stored in localStorage
        problemId: parseInt(problemId),
        code,
        results: testResults,
        isCorrect,
      };

      // Submit the code to the backend
      await createSubmission(submissionData, userToken);

      if (isCorrect) {
        toast.success("Submission successful", {
          description: "All test cases passed!",
        });
      } else {
        const passedTests = testResults.filter((test) => test.passed).length;
        toast.error("Submission failed", {
          description: `${passedTests}/${testResults.length} test cases passed`,
        });
      }

      return isCorrect;
    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMessage = error?.message || "Unknown error occurred";

      toast.error("Error submitting code", {
        description: errorMessage,
      });
      return false;
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="flex flex-col h-screen bg-leetcode-bg-dark">
      <Navbar />

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Problem description panel */}
        <div className="w-full md:w-1/2 md:border-r border-leetcode-bg-light overflow-hidden flex flex-col">
          <div className="flex items-center p-2 border-b border-leetcode-bg-light">
            <div className="flex-1 flex">
              {prevProblem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/problem/${prevProblem.id}`)}
                  className="text-leetcode-text-secondary"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/problems")}
              className="text-leetcode-text-secondary"
            >
              All Problems
            </Button>

            <div className="flex-1 flex justify-end">
              {nextProblem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/problem/${nextProblem.id}`)}
                  className="text-leetcode-text-secondary"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProblemDescription
                title={problem.title}
                difficulty={problem.difficulty as "easy" | "medium" | "hard"}
                description={problem.description}
                examples={problem.examples}
                constraints={problem.constraints}
              />

              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Comments problemId={Number(problemId)} />
                </motion.div>
              )}

              <div className="px-6 pb-4">
                <Button
                  variant="outline"
                  onClick={toggleComments}
                  className="w-full border-leetcode-bg-light"
                >
                  {showComments ? "Hide Comments" : "Show Comments"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Code editor panel */}
        <div className="w-full md:w-1/2 overflow-hidden flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="h-full"
          >
            <CodeEditor
              initialCode={problem.starterCode}
              language="Java"
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
