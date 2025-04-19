import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Send, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommentsByProblem, createComment, likeComment } from "@/api";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  problemId: number;
  likes?: number;
  user?: {
    id: number;
    name: string;
  };
}

interface CommentsProps {
  problemId: number;
}

const Comments: React.FC<CommentsProps> = ({ problemId }) => {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getCommentsByProblem(problemId, token);
      setComments(data);
      setIsLoaded(true);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  }, [problemId, token]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.id) return;

    try {
      const created = await createComment(
        {
          content: newComment,
          problemId,
          userId: user.id,
        },
        token
      );

      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleLike = async (commentId: number) => {
    try {
      const updated = await likeComment(commentId, token);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: updated.likes }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  return (
    <div className="bg-leetcode-bg-medium rounded-lg p-4 mt-4">
      <header className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 text-leetcode-blue mr-2" />
        <h2 className="text-lg font-semibold">Discussion</h2>
      </header>

      <section className="mb-6">
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
      </section>

      <AnimatePresence>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: isLoaded ? 0 : index * 0.1,
            }}
            className="border-t border-leetcode-bg-light py-4"
          >
            <div className="flex items-center mb-2">
              <div className="bg-leetcode-bg-light rounded-full p-2 mr-2">
                <User className="h-4 w-4 text-leetcode-text-secondary" />
              </div>
              <span className="font-medium">{comment.user?.name || "You"}</span>
              <span className="text-xs text-leetcode-text-secondary ml-2">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-leetcode-text-primary mb-2">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(comment.id)}
              className="text-leetcode-text-secondary hover:text-leetcode-blue"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span className="text-xs">{comment.likes || 0}</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Comments;
