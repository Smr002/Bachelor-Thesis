import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, List, Timer, Trophy, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import { getSubmissionsByUser, getProblem, getLeaderboard } from "@/api";
import { Submission } from "@/types/submission";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string | number;
  id?: string | number;
  [key: string]: any;
}

interface EnhancedSubmission extends Submission {
  problemName?: string;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  bgColorClass: string;
  title: string;
  description: string;
  submissions?: EnhancedSubmission[];
}> = ({ icon, bgColorClass, title, description, submissions }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.03 }}
      className="bg-leetcode-bg-medium p-6 rounded-lg"
    >
      <div className="flex items-center mb-4">
        <div className={`${bgColorClass} p-3 rounded-lg`}>{icon}</div>
        <h2 className="ml-3 text-xl font-semibold">{title}</h2>
      </div>
      {submissions ? (
        <div className="text-leetcode-text-secondary">
          <ul className="space-y-2">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <li
                  key={submission.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${
                        submission.isCorrect
                          ? "bg-leetcode-green"
                          : "bg-leetcode-red"
                      }`}
                    ></span>
                    <Link
                      to={`/problem/${submission.problemId}`}
                      className="hover:underline"
                    >
                      {submission.problemName || "Unknown Problem"}
                    </Link>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            ) : (
              <p>No recent submissions found.</p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-leetcode-text-secondary">{description}</p>
      )}
    </motion.div>
  );
};

const CTASection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-leetcode-bg-medium p-8 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6">
        Ready to improve your coding skills?
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <p className="text-leetcode-text-secondary mb-4">
            Start with our collection of algorithm problems, from data
            structures to dynamic programming and beyond.
          </p>
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 rounded-full bg-leetcode-green mr-2"></div>
              <span className="text-sm">Easy</span>
            </div>
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 rounded-full bg-leetcode-yellow mr-2"></div>
              <span className="text-sm">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-leetcode-red mr-2"></div>
              <span className="text-sm">Hard</span>
            </div>
          </div>
        </div>
        <Link to="/problems">
          <Button className="bg-leetcode-blue hover:bg-leetcode-blue/90">
            <List className="h-4 w-4 mr-2" />
            View Problems
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const LeaderboardSection: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<
    { userId: number; username: string; problemsSolved: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view leaderboard.");
          return;
        }
        const data = await getLeaderboard(3, token);
        

        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch leaderboard.");
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-leetcode-bg-medium p-8 rounded-lg mt-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-leetcode-text-primary">
        Top Coders Leaderboard
      </h2>
      {error ? (
        <p className="text-leetcode-text-secondary">{error}</p>
      ) : leaderboard.length > 0 ? (
        <ul className="space-y-3">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.userId}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="mr-3 text-leetcode-text-primary font-semibold">
                  {index + 1}.
                </span>
                <Trophy
                  className={`h-5 w-5 mr-2 ${
                    index === 0
                      ? "text-leetcode-yellow"
                      : index === 1
                      ? "text-leetcode-blue"
                      : "text-leetcode-green"
                  }`}
                />
                <span className="text-leetcode-text-primary">
                  {entry.username}
                </span>
              </div>
              <span className="text-leetcode-text-secondary">
                {entry.problemsSolved} solved
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-leetcode-text-secondary">
          No leaderboard data available.
        </p>
      )}
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [submissions, setSubmissions] = useState<EnhancedSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your recent submissions.");
          navigate("/login");
          return;
        }
        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.sub || decoded.id;
        if (!userId) {
          setError("Invalid token. Please log in again.");
          navigate("/login");
          return;
        }
        const data = await getSubmissionsByUser(Number(userId), 5, token);
        const enhancedSubmissions = await Promise.all(
          data.map(async (submission: EnhancedSubmission) => {
            try {
              const problem = await getProblem(submission.problemId, token);
              return { ...submission, problemName: problem.title };
            } catch (err) {
              return { ...submission, problemName: "Unknown Problem" };
            }
          })
        );
        setSubmissions(enhancedSubmissions);
      } catch (err: any) {
        setError(err.message || "Failed to fetch submissions.");
      } finally {
        setIsLoaded(true);
      }
    };
    fetchSubmissions();
  }, [navigate]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-leetcode-bg-dark">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">
              Master Algorithms & Data Structures
            </h1>
            <p className="text-xl text-leetcode-text-secondary max-w-2xl mx-auto">
              Practice coding challenges, enhance your problem-solving skills,
              and prepare for technical interviews.
            </p>
            <div className="mt-8">
              <Link to="/problems">
                <Button
                  size="lg"
                  className="bg-leetcode-blue hover:bg-leetcode-blue/90"
                >
                  Start Coding Now
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="grid md:grid-cols-4 gap-8 mb-16"
          >
            <FeatureCard
              icon={<Code className="h-6 w-6 text-leetcode-green" />}
              bgColorClass="bg-leetcode-green/20"
              title="Curated Problems"
              description="Practice with a collection of carefully selected algorithm problems ranging from easy to hard."
            />
            <FeatureCard
              icon={<Timer className="h-6 w-6 text-leetcode-yellow" />}
              bgColorClass="bg-leetcode-yellow/20"
              title="Real-time Testing"
              description="Test your solutions instantly and get immediate feedback on your code performance."
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6 text-leetcode-red" />}
              bgColorClass="bg-leetcode-red/20"
              title="Track Progress"
              description="Monitor your coding journey as you solve more problems and improve your skills."
            />
            <FeatureCard
              icon={<FileCode className="h-6 w-6 text-leetcode-blue" />}
              bgColorClass="bg-leetcode-blue/20"
              title="Recent Submissions"
              description={
                error ||
                "View your recent submissions and track your coding history."
              }
              submissions={submissions}
            />
          </motion.div>
          <CTASection />
          <LeaderboardSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
