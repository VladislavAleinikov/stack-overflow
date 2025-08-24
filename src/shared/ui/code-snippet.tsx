// shared/ui/code-snippet/ui/code-snippet-enhanced.tsx
import { useColorScheme } from "@mui/material";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

type Language =
  | "javascript"
  | "typescript"
  | "css"
  | "html"
  | "python"
  | "java";

interface CodeSnippetProps {
  code: string;
  language: Language | string;
  showLineNumbers?: boolean;
  className?: string;
  copyable?: boolean;
  maxHeight?: number;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language,
  showLineNumbers = false,
  className = "",
  copyable = true,
  maxHeight = 300,
}) => {
  const [copied, setCopied] = useState(false);
  const { mode, systemMode } = useColorScheme();
  const themeStyle = getThemeStyle(mode, systemMode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  function getThemeStyle(
    mode: "light" | "dark" | "system" | undefined,
    systemMode: "light" | "dark" | undefined
  ) {
    if (mode === "dark") {
      return oneDark;
    } else if (mode === "light") {
      return oneLight;
    } else {
      return systemMode === "dark" ? oneDark : oneLight;
    }
  }

  return (
    <div
      className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {language.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {copyable && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Копировать код"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>{copied ? "Скопировано!" : "Копировать"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={themeStyle}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: mode === "light" ? "#fafafa" : "#1f2937",
            fontSize: "14px",
          }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
