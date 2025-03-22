
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { problems } from '@/data/problems';
import Navbar from '@/components/Navbar';

const ProblemsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

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
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className={`py-1 px-3 text-sm ${
                      difficulty === level 
                        ? level === 'Easy' 
                          ? 'bg-leetcode-green' 
                          : level === 'Medium'
                            ? 'bg-leetcode-yellow text-black'
                            : level === 'Hard'
                              ? 'bg-leetcode-red'
                              : 'bg-leetcode-blue'
                        : 'bg-leetcode-bg-medium text-leetcode-text-primary border-leetcode-bg-light'
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leetcode-text-secondary uppercase tracking-wider">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leetcode-bg-light">
                {filteredProblems.map((problem) => (
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
                          problem.difficulty === 'Easy' ? 'bg-leetcode-green/20 text-leetcode-green' :
                          problem.difficulty === 'Medium' ? 'bg-leetcode-yellow/20 text-leetcode-yellow' :
                          'bg-leetcode-red/20 text-leetcode-red'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemsPage;
