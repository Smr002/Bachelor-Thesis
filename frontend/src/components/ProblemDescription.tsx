import React from "react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface ProblemDescriptionProps {
  title: string;
  difficulty: "easy" | "medium" | "hard"; // Note: lowercase difficulty
  description: string;
  examples: any[];
  constraints: string[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  title,
  difficulty,
  description,
  examples,
  constraints,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-leetcode-green/20 text-leetcode-green";
      case "medium":
        return "bg-leetcode-yellow/20 text-leetcode-yellow";
      case "hard":
        return "bg-leetcode-red/20 text-leetcode-red";
      default:
        return "bg-leetcode-blue/20 text-leetcode-blue";
    }
  };

  return (
    <div className="p-6 overflow-y-auto problem-description">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-leetcode-text-primary">
          {title}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(
            difficulty
          )}`}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
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
                <span className="font-medium">Explanation:</span>{" "}
                {example.explanation}
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
