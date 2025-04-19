import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CodeRunner from "./CodeRunner";
import MonacoEditor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  initialCode: string;
  language: string; // e.g. "java", "javascript", "python"
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
  const runnerRef = useRef<HTMLDivElement>(null);

  const editorDidMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("algostruct-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "585b70", fontStyle: "italic" },
        { token: "keyword", foreground: "89b4fa", fontStyle: "bold" },
        { token: "number", foreground: "fab387" },
        { token: "string", foreground: "a6e3a1" },
        { token: "variable", foreground: "cdd6f4" },
        { token: "parameter", foreground: "f9e2af" },
        { token: "type", foreground: "8bd5ca" },
        { token: "class", foreground: "f5c2e7" },
        { token: "function", foreground: "89dceb" },
        { token: "operator", foreground: "89b4fa" },
        { token: "delimiter", foreground: "cdd6f4" },
        { token: "namespace", foreground: "f9e2af" },
      ],
      colors: {
        "editor.background": "#1e1e2e",
        "editor.foreground": "#cdd6f4",
        "editorLineNumber.foreground": "#6c7086",
        "editorCursor.foreground": "#f5c2e7",
        "editor.lineHighlightBackground": "#313244",
        "editor.selectionBackground": "#585b70",
      },
    });

    monaco.editor.setTheme("algostruct-dark");
  };

  const handleRun = () => {
    if (!isRunning) {
      setIsRunning(true);
      setTriggerRun(true);
      setTimeout(() => {
        runnerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleRunComplete = () => {
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const passed = await onSubmit(code);
      toast({
        title: passed ? "Success!" : "Wrong answer",
        description: passed
          ? "All test cases passed 🎉"
          : "Some test cases failed 😕",
        variant: passed ? "default" : "destructive",
      });
    } catch (err) {
      toast({ title: "Error", description: `${err}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-leetcode-bg-medium border-b border-leetcode-bg-light">
        <span className="text-sm font-medium capitalize">{language}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
            disabled={isRunning}
            className="bg-leetcode-bg-light text-leetcode-text-primary border-leetcode-bg-light"
          >
            <Play className="h-4 w-4 mr-1" /> Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-leetcode-green hover:bg-leetcode-green/90 text-white"
          >
            <Check className="h-4 w-4 mr-1" /> Submit
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <MonacoEditor
          language={language.toLowerCase()}
          theme="algostruct-dark"
          value={code}
          defaultValue={initialCode}
          onMount={editorDidMount}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
          }}
          height="100%"
        />
      </div>

      <div
        ref={runnerRef}
        className="p-4 bg-leetcode-bg-medium border-t border-leetcode-bg-light"
      >
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
