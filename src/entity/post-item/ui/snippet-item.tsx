import type { FCWithSkeleton, Snippet } from "@/shared/types";
import { Skeleton } from "@mui/material";
import { CodeSnippet } from "@/shared/ui/code-snippet";

interface SnippetItemProps {
  snippet: Snippet;
}

export const SnippetItem: FCWithSkeleton<SnippetItemProps> = ({ snippet }) => {
  return (
    <div>
      <CodeSnippet
        code={snippet.code}
        language="javascript"
        showLineNumbers={true}
        copyable={true}
        maxHeight={150}
      />
    </div>
  );
};

SnippetItem.Skeleton = () => {
  return <Skeleton variant="rounded" className="w-[200px] h-[200px]" />;
};
