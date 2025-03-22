
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Search, Copy, Bookmark, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  saved: boolean;
}

const mockSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Two Sum Solution',
    code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    language: 'javascript',
    tags: ['array', 'hash table'],
    saved: true
  },
  {
    id: '2',
    title: 'Valid Parentheses Solution',
    code: 'function isValid(s) {\n  const stack = [];\n  const map = {\n    \'(\': \')\',\n    \'{\': \'}\',\n    \'[\': \']\'\n  };\n  \n  for (let i = 0; i < s.length; i++) {\n    if (s[i] === \'(\' || s[i] === \'{\' || s[i] === \'[\') {\n      stack.push(s[i]);\n    } else {\n      const last = stack.pop();\n      if (s[i] !== map[last]) return false;\n    }\n  }\n  \n  return stack.length === 0;\n}',
    language: 'javascript',
    tags: ['stack', 'string'],
    saved: false
  },
  {
    id: '3',
    title: 'Binary Search Template',
    code: 'function binarySearch(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  \n  return -1;\n}',
    language: 'javascript',
    tags: ['binary search', 'algorithm'],
    saved: true
  }
];

const CodeSnippetsPage: React.FC = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setSnippets(mockSnippets);
      setIsLoaded(true);
    }, 500);
  }, []);
  
  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard!",
      description: "The code snippet has been copied to your clipboard.",
    });
  };
  
  const toggleSaved = (id: string) => {
    setSnippets(
      snippets.map(snippet => 
        snippet.id === id 
          ? { ...snippet, saved: !snippet.saved } 
          : snippet
      )
    );
    
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      toast({
        title: snippet.saved ? "Removed from saved" : "Added to saved",
        description: `"${snippet.title}" has been ${snippet.saved ? "removed from" : "added to"} your saved snippets.`,
      });
    }
  };
  
  const deleteSnippet = (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    setSnippets(snippets.filter(s => s.id !== id));
    
    if (snippet) {
      toast({
        title: "Snippet deleted",
        description: `"${snippet.title}" has been deleted.`,
      });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-leetcode-bg-dark">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-block p-3 bg-leetcode-blue/10 rounded-full mb-4">
            <Code className="h-8 w-8 text-leetcode-blue animate-pulse-glow" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Code Snippets</h1>
          <p className="text-leetcode-text-secondary">Save and reuse code snippets for common algorithm patterns</p>
        </motion.div>
        
        <div className="mb-8 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
            <Input
              type="text"
              placeholder="Search by title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-leetcode-bg-medium border-leetcode-bg-light focus:border-leetcode-blue"
            />
          </div>
          
          <Button className="bg-leetcode-blue hover:bg-leetcode-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            New Snippet
          </Button>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredSnippets.map(snippet => (
              <motion.div
                key={snippet.id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
                layout
                className="bg-leetcode-bg-medium rounded-lg overflow-hidden border border-leetcode-bg-light hover-lift"
              >
                <div className="p-4 border-b border-leetcode-bg-light">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{snippet.title}</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(snippet.code)}
                        className="text-leetcode-text-secondary hover:text-leetcode-blue"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSaved(snippet.id)}
                        className={snippet.saved ? "text-leetcode-yellow" : "text-leetcode-text-secondary hover:text-leetcode-yellow"}
                      >
                        <Bookmark className="h-4 w-4" fill={snippet.saved ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSnippet(snippet.id)}
                        className="text-leetcode-text-secondary hover:text-leetcode-red"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex mt-2 flex-wrap gap-1">
                    {snippet.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-leetcode-bg-light rounded-full text-leetcode-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto text-sm bg-leetcode-bg-dark font-mono">
                  <code>{snippet.code}</code>
                </pre>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeSnippetsPage;
