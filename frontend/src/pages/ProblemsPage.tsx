import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { findAllProblem } from "@/api";
import { Problem } from "@/types/problem";
import { toast } from "@/components/ui/use-toast";

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (!userToken) return;
        const data = await findAllProblem(userToken);
        const normalized = data.map((p: any) => ({
          ...p,
          examples: p.Example ?? [],
          difficulty: p.difficulty.toLowerCase(),
        }));
        setProblems(normalized);
      } catch (err: any) {
        toast({
          title: "Error fetching problems",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [userToken]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-leetcode-bg-dark">
        <Navbar />
        <main className="flex-grow p-6 flex items-center justify-center">
          <div className="text-leetcode-text-secondary">
            Loading problems...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-leetcode-bg-dark">
      <Navbar />

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Problem Set</h1>

            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
                <Input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-leetcode-bg-medium border-leetcode-bg-light w-64"
                />
              </div>

              <div className="flex rounded overflow-hidden">
                {(["All", "Easy", "Medium", "Hard"] as const).map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className={`py-1 px-3 text-sm ${
                      difficulty === level
                        ? level === "Easy"
                          ? "bg-leetcode-green"
                          : level === "Medium"
                          ? "bg-leetcode-yellow text-black"
                          : level === "Hard"
                          ? "bg-leetcode-red"
                          : "bg-leetcode-blue"
                        : "bg-leetcode-bg-medium text-leetcode-text-primary border-leetcode-bg-light"
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-leetcode-bg-medium rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-leetcode-bg-light">
              <thead className="bg-leetcode-bg-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leetcode-bg-light">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-leetcode-text-secondary"
                    >
                      No problems found
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-leetcode-bg-light">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {problem.completed ? (
                          <Check className="h-5 w-5 text-leetcode-green" />
                        ) : (
                          <span className="h-5 w-5 inline-block"></span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/problem/${problem.id}`}
                          className="text-leetcode-text-primary hover:text-leetcode-blue"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            problem.difficulty === "easy"
                              ? "bg-leetcode-green/20 text-leetcode-green"
                              : problem.difficulty === "medium"
                              ? "bg-leetcode-yellow/20 text-leetcode-yellow"
                              : "bg-leetcode-red/20 text-leetcode-red"
                          }`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() +
                            problem.difficulty.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemsPage;
