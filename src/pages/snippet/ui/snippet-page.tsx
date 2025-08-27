import { DetailedSnippet } from "@/widgets/detailed-snippet";
import { Suspense } from "react";
import { useParams } from "react-router";

export const SnippetPage = () => {
  const params = useParams();
  
  return (
    <div className="h-full flex flex-col justify-center items-center space-y-12">
      <Suspense fallback={<DetailedSnippet.Skeleton />}>
        <DetailedSnippet snippetId={parseInt(params.id!)} />
      </Suspense>
    </div>
  );
};