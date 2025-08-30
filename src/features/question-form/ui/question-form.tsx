import { Languages, type Question } from "@/shared/types";
import {
  Dialog,
  DialogTitle,
  useColorScheme,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { getThemeStyle, langExtentions } from "@/entity/code-snippet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddQuestionMutationOptions } from "../query-options/create-add-question-mutation-options";
import { createUpdateQuestionMutationOptions } from "../query-options/create-update-question-mutation-options";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { createDeleteQuestionMutationOptions } from "../query-options/create-delete-question-mutation-options";

interface QuestionFormProps {
  open: boolean;
  onClose: () => void;
  question?: Question;
  className?: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  open,
  onClose,
  question,
  className,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachedCode, setAttachedCode] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutateAsync: addQuestion } = useMutation(
    createAddQuestionMutationOptions()
  );
  const { mutateAsync: updateQuestion } = useMutation(
    createUpdateQuestionMutationOptions(question?.id || -1)
  );
  const { mutateAsync: deleteQuestion } = useMutation(
    createDeleteQuestionMutationOptions(question?.id || -1)
  );
  const { mode, systemMode } = useColorScheme();
  const themeStyle = getThemeStyle(mode, systemMode);
  const isButtonDisabled =
    !title.length ||
    !description.length ||
    !attachedCode.length ||
    (title === question?.title &&
      description === question?.description &&
      attachedCode === question?.attachedCode);

  const onRequest = (promise: Promise<unknown>) => {
    promise
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        onClose();
      })
      .catch(() => {});
  };

  useEffect(() => {
    setTitle(question?.title || "");
    setDescription(question?.description || "");
    setAttachedCode(question?.attachedCode || "");
  }, [question]);

  return (
    <Dialog
      className={className}
      open={open}
      onClose={onClose}
      data-testid="dialog"
    >
      <DialogTitle className="uppercase text-4xl text-center tracking-widest">
        {question ? "Edit question" : "Ask question"}
      </DialogTitle>
      <DialogContent className="space-y-4 p-5">
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title"
          type="search"
          variant="standard"
          className="w-full"
        />
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
          multiline
          maxRows={8}
          className="w-full"
        />
        <CodeMirror
          value={question?.attachedCode}
          editable={true}
          theme={themeStyle}
          extensions={[langExtentions[Languages.JavaScript]]}
          className="text-sm text-left w-[400px]"
          height="200px"
          onChange={(val) => setAttachedCode(val)}
          data-testid="code-input"
        />
        {question ? (
          <>
            <Button
              variant="contained"
              onClick={() =>
                onRequest(updateQuestion({ title, description, attachedCode }))
              }
              disabled={isButtonDisabled}
              data-testid="update-button"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Save changes
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAlertOpen(true)}
              color="error"
              className="float-right"
              data-testid="delete-button"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              Delete question
            </Button>
            <AlertDialog
              open={isAlertOpen}
              title="Are you shure you want to delete this question?"
              text="This action can't be canceled"
              onConfirm={() => onRequest(deleteQuestion())}
              onClose={() => setIsAlertOpen(false)}
            />
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => addQuestion({ title, description, attachedCode })}
            disabled={isButtonDisabled}
            data-testid="add-button"
          >
            <AddIcon className="w-4 h-4 mr-2" />
            Add question
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
