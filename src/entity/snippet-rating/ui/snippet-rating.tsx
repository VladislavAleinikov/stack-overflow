import { MarkType, type FCWithSkeleton } from "@/shared/types";
import { Button, Skeleton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface SnippetRatingProps {
  rating: number;
  onLike: () => void;
  onDislike: () => void;
  status?: MarkType;
  disabled: boolean;
}

export const SnippetRating: FCWithSkeleton<SnippetRatingProps> = ({
  rating,
  onLike,
  onDislike,
  status,
  disabled,
}) => {
  return (
    <div className="flex flex-col self-start">
      <Button
        variant="outlined"
        className="min-w-min w-[50px] h-[50px] p-0 rounded-full"
        onClick={onLike}
        disabled={disabled || status === MarkType.LIKE}
      >
        <ExpandLessIcon />
      </Button>
      <span className="flex justify-center items-center w-[50px] h-[50px] rounded-full text-2xl">
        {rating}
      </span>
      <Button
        variant="outlined"
        className="min-w-min w-[50px] h-[50px] p-0 rounded-full"
        onClick={onDislike}
        disabled={disabled || status === MarkType.DISLIKE}
      >
        <ExpandMoreIcon />
      </Button>
    </div>
  );
};
SnippetRating.Skeleton = () => {
  return (
    <div className="flex flex-col self-start">
      <Skeleton variant="circular" className="w-[50px] h-[50px]" />
      <Skeleton variant="rounded" className="w-[20px] h-[30px] my-[10px] mx-[15px]" />
      <Skeleton variant="circular" className="w-[50px] h-[50px]" />
    </div>
  );
};
