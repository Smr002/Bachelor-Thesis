import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProblemDescription from '@/components/ProblemDescription';
import CodeEditor from '@/components/CodeEditor';
import Comments from '@/components/Comments';
import { problems } from '@/data/problems';
import { Button } from '@/components/ui/button';

const ProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problemId = parseInt(id || '1');
  
  const problem = problems.find(p => p.id === problemId);
  const [showComments, setShowComments] = useState(false);
  const [code, setCode] = useState('');
  
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode);
    }
  }, [problem]);
  
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-leetcode-bg-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
          <Button onClick={() => navigate('/problems')}>
            Go Back to Problems
          </Button>
        </div>
      </div>
    );
  }
  
  const nextProblem = problems.find(p => p.id > problemId);
  const prevProblem = [...problems].reverse().find(p => p.id < problemId);
  
  const handleRunCode = async (code: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const result = new Function(`
            "use strict";
            ${code}
            
            // Test against the first example
            ${getProblemTestCode(problem)}
          `)();
          
          resolve(result);
        } catch (error) {
          resolve({ error: String(error) });
        }
      }, 1000);
    });
  };
  
  const handleSubmitCode = async (code: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        try {
          new Function(`
            "use strict";
            ${code}
            
            // Test against the first example
            ${getProblemTestCode(problem)}
          `)();
          
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      }, 1500);
    });
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
              onClick={() => navigate('/problems')}
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
                difficulty={problem.difficulty as 'Easy' | 'Medium' | 'Hard'}
                description={problem.description}
                examples={problem.examples}
                constraints={problem.constraints}
              />
              
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Comments problemId={problemId} />
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
              language="javascript"
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate test code for the problem
const getProblemTestCode = (problem: any) => {
  if (problem.id === 1) {
    return `
      const result = twoSum([2,7,11,15], 9);
      if (!Array.isArray(result) || result.length !== 2 || 
          (result[0] !== 0 || result[1] !== 1) && (result[0] !== 1 || result[1] !== 0)) {
        throw new Error("Test case failed");
      }
      return "Test passed!";
    `;
  } else if (problem.id === 2) {
    return `
      const result1 = isValid("()");
      const result2 = isValid("()[]{}");
      const result3 = isValid("(]");
      
      if (result1 !== true || result2 !== true || result3 !== false) {
        throw new Error("Test case failed");
      }
      
      return "Test passed!";
    `;
  } else {
    return `return "Test executed (no validation implemented for this problem)";`;
  }
};

export default ProblemPage;
