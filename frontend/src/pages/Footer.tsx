import { Code } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-leetcode-bg-medium py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Code className="h-6 w-6 text-leetcode-blue mr-2" />
          <span className="font-semibold">AlgoLearn</span>
        </div>
        <div className="text-leetcode-text-secondary text-sm">
          © 2025 AlgoLearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
