
import React from 'react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface ProblemDescriptionProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Example[];
  constraints: string[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  title,
  difficulty,
  description,
  examples,
  constraints,
}) => {
  return (
    <div className="p-6 overflow-y-auto problem-description">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      
      <div 
        className={`inline-block mb-4 px-2 py-1 rounded text-xs font-medium ${
          difficulty === 'Easy' ? 'bg-leetcode-green/20 text-leetcode-green' :
          difficulty === 'Medium' ? 'bg-leetcode-yellow/20 text-leetcode-yellow' :
          'bg-leetcode-red/20 text-leetcode-red'
        }`}
      >
        {difficulty}
      </div>
      
      <div className="mb-6">
        <p className="whitespace-pre-line">{description}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Examples:</h2>
        {examples.map((example, index) => (
          <div key={index} className="mb-4 p-3 bg-leetcode-bg-medium rounded">
            <div className="mb-2">
              <span className="font-medium">Input:</span> {example.input}
            </div>
            <div className="mb-2">
              <span className="font-medium">Output:</span> {example.output}
            </div>
            {example.explanation && (
              <div>
                <span className="font-medium">Explanation:</span> {example.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
        <ul className="list-disc pl-5">
          {constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemDescription;
