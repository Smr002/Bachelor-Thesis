
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Send, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentsProps {
  problemId: number;
}

const Comments: React.FC<CommentsProps> = ({ problemId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock data - in a real app, you'd fetch from an API/database
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        author: 'AlgoMaster',
        content: 'I found using a hash map made this problem much easier to solve.',
        timestamp: '2 hours ago',
        likes: 5
      },
      {
        id: '2',
        author: 'CodeNinja',
        content: 'The key insight is to use two pointers to optimize the solution from O(n²) to O(n).',
        timestamp: '1 day ago',
        likes: 12
      }
    ];
    
    setTimeout(() => {
      setComments(mockComments);
      setIsLoaded(true);
    }, 500);
  }, [problemId]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };
  
  const handleLike = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  return (
    <div className="bg-leetcode-bg-medium rounded-lg p-4 mt-4">
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 text-leetcode-blue mr-2" />
        <h2 className="text-lg font-semibold">Discussion</h2>
      </div>
      
      {/* Add comment form */}
      <div className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your approach or ask a question..."
          className="bg-leetcode-bg-dark resize-none mb-2 text-leetcode-text-primary"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment} 
            className="bg-leetcode-blue hover:bg-leetcode-blue/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      <AnimatePresence>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              delay: isLoaded ? 0 : index * 0.1
            }}
            className="border-t border-leetcode-bg-light py-4 animate-float"
          >
            <div className="flex items-center mb-2">
              <div className="bg-leetcode-bg-light rounded-full p-2 mr-2">
                <User className="h-4 w-4 text-leetcode-text-secondary" />
              </div>
              <span className="font-medium">{comment.author}</span>
              <span className="text-xs text-leetcode-text-secondary ml-2">{comment.timestamp}</span>
            </div>
            <p className="text-leetcode-text-primary mb-2">{comment.content}</p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleLike(comment.id)}
              className="text-leetcode-text-secondary hover:text-leetcode-blue"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span className="text-xs">{comment.likes}</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Comments;
