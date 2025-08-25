import { useColorScheme } from "@mui/material";
import { useNavigate } from "react-router";
import React, { useState } from "react";
import type { Languages, User } from "../../../shared/types";
import CodeMirror from "@uiw/react-codemirror";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import { langExtentions } from "../consts";
import { getThemeStyle } from "../utils";

interface CodeSnippetProps {
  author: User;
  snippetId: number;
  code: string;
  language: Languages;
  showLineNumbers?: boolean;
  className?: string;
  copyable?: boolean;
  isThisAuthor?: boolean;
  maxHeight?: number;
  onEdit?: () => void;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  author,
  snippetId,
  code,
  language,
  className = "",
  copyable = true,
  isThisAuthor = false,
  maxHeight = 300,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { mode, systemMode } = useColorScheme();
  const themeStyle = getThemeStyle(mode, systemMode);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  

  return (
    <div
      className={`w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <span className="text-xs text-gray-700 dark:text-gray-300">
          {language.toString().toUpperCase()}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ContentCopyIcon className="w-4 h-4 mr-2" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        )}
      </div>

      <div className="relative">
        <CodeMirror
          value={code}
          editable={false}
          theme={themeStyle}
          extensions={[langExtentions[language]]}
          className="text-left"
          maxHeight={`${maxHeight}px`}
        />
      </div>

      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2">
        {isThisAuthor ? (
          <button
            onClick={onEdit}
            className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <EditIcon className="w-4 h-4 mr-2" />
            <span>Edit</span>
          </button>
        ) : (
          <button
            onClick={() => navigate(`/users/${author.id}`)}
            className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <PersonIcon className="w-4 h-4 mr-2" />
            <span>{author.username}</span>
          </button>
        )}

        <button
          onClick={() => navigate(`/snippets/${snippetId}`)}
          className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <CommentIcon className="w-4 h-4 mr-2" />
          <span>Comments</span>
        </button>
      </div>
    </div>
  );
};
