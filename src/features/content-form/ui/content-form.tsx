import type { FCWithSkeleton } from "@/shared/types";
import { contentSchema, type ContentFormValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Skeleton, TextField } from "@mui/material";

interface ContentFormProps {
  title: string;
  onSubmit: (data: ContentFormValues) => void;
  isDisabled: boolean;
}

export const ContentForm: FCWithSkeleton<ContentFormProps> = ({
  title,
  onSubmit,
  isDisabled,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
      className="w-full flex flex-col space-y-4"
    >
      <h4 className="uppercase tracking-widest text-3xl">{title}</h4>
      <TextField
        {...register("content")}
        label={
          errors["content"] ? errors["content"].message : `Write your ${title}`
        }
        multiline
        rows={4}
        error={!!errors["content"]}
      />
      <Button
        type="submit"
        variant="contained"
        className="self-start"
        disabled={isDisabled}
      >
        Add {title}
      </Button>
    </form>
  );
};

ContentForm.Skeleton = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <Skeleton variant="rounded" className="w-[250px] h-[36px]" />
      <Skeleton variant="rounded" className="w-full h-[125px]" />
      <Skeleton variant="rounded" className="w-[125px] h-[36px]" />
    </div>
  );
};
