
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

type Problem = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
};

interface SidebarProps {
  problems: Problem[];
  activeProblemId?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ problems, activeProblemId }) => {
  return (
    <div className="w-64 bg-leetcode-bg-medium border-r border-leetcode-bg-light h-full overflow-y-auto">
      <div className="p-4 border-b border-leetcode-bg-light">
        <h2 className="font-semibold text-lg">Problems</h2>
      </div>
      
      <div className="p-2">
        <div className="flex justify-between p-2 mb-2 text-sm text-leetcode-text-secondary">
          <span>Status</span>
          <span>Title</span>
          <span>Difficulty</span>
        </div>
        
        <ul>
          {problems.map((problem) => (
            <li key={problem.id}>
              <Link 
                to={`/problem/${problem.id}`}
                className={`flex items-center justify-between p-2 rounded hover:bg-leetcode-bg-light ${
                  activeProblemId === problem.id ? 'bg-leetcode-bg-light' : ''
                }`}
              >
                <span>
                  {problem.completed ? (
                    <Check className="h-4 w-4 text-leetcode-green" />
                  ) : (
                    <X className="h-4 w-4 opacity-0" />
                  )}
                </span>
                <span className="flex-grow ml-2 text-sm">
                  {problem.title}
                </span>
                <span 
                  className={`text-xs px-2 py-0.5 rounded ${
                    problem.difficulty === 'Easy' ? 'text-leetcode-green' :
                    problem.difficulty === 'Medium' ? 'text-leetcode-yellow' :
                    'text-leetcode-red'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
