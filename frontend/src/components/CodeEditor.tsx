import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CodeRunner from "./CodeRunner";

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRun: (code: string) => Promise<any>;
  onSubmit: (code: string) => Promise<boolean>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onRun,
  onSubmit,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triggerRun, setTriggerRun] = useState(false);

  const handleRun = () => {
    if (!isRunning) {
      setIsRunning(true);
      setTriggerRun(true); // Trigger CodeRunner to run the code
    }
  };

  const handleRunComplete = () => {
    setIsRunning(false); // Reset isRunning when execution completes
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const success = await onSubmit(code);

      if (success) {
        toast({
          title: "Success!",
          description: "Your solution passed all test cases.",
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect solution",
          description: "Your solution failed one or more test cases.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-leetcode-bg-medium border-b border-leetcode-bg-light">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
            disabled={isRunning}
            className="bg-leetcode-bg-light text-leetcode-text-primary border-leetcode-bg-light"
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-leetcode-green hover:bg-leetcode-green/90 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-leetcode-bg-dark text-leetcode-text-primary resize-none outline-none code-editor"
          spellCheck={false}
        />
      </div>

      <div className="p-4 bg-leetcode-bg-medium border-t border-leetcode-bg-light">
        <CodeRunner
          onRun={onRun}
          code={code}
          isRunning={isRunning}
          triggerRun={triggerRun}
          setTriggerRun={setTriggerRun}
          onRunComplete={handleRunComplete}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
