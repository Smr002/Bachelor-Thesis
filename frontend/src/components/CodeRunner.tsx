import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Spinner = () => {
  return (
    <motion.div
      style={{
        width: 24,
        height: 24,
        border: "3px solid rgba(255, 255, 255, 0.2)",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
};

interface CodeRunnerProps {
  onRun: (code: string) => Promise<any>;
  code: string;
  isRunning: boolean;
  triggerRun: boolean;
  setTriggerRun: (value: boolean) => void;
  onRunComplete: () => void;
}

const CodeRunner: React.FC<CodeRunnerProps> = ({
  onRun,
  code,
  isRunning,
  triggerRun,
  setTriggerRun,
  onRunComplete,
}) => {
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    if (triggerRun) {
      const runCode = async () => {
        setOutput(null); // Clear previous output
        try {
          const result = await onRun(code);
          setOutput(JSON.stringify(result, null, 2));
        } catch (error) {
          setOutput(`Error: ${error}`);
        } finally {
          setTriggerRun(false);
          onRunComplete();
        }
      };
      runCode();
    }
  }, [triggerRun, code, onRun, setTriggerRun, onRunComplete]);

  return (
    <div className="relative">
      {/* Output container */}
      <AnimatePresence mode="wait">
        {isRunning || output ? (
          <motion.div
            key={isRunning ? "running" : "output"}
            className="p-4 bg-gray-800 text-white rounded-md shadow-md border border-gray-700"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isRunning ? (
              <motion.div
                className="flex items-center justify-center py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Spinner />
                <motion.span
                  className="ml-3 text-sm font-medium text-gray-300"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Running...
                </motion.span>
              </motion.div>
            ) : (
              <pre className="text-sm whitespace-pre-wrap">{output}</pre>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default CodeRunner;
