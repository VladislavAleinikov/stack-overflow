import { Languages, type Snippet } from "@/shared/types";
import {
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useColorScheme,
  type SelectChangeEvent,
  DialogContent,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { getThemeStyle, langExtentions } from "@/entity/code-snippet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddSnippetMutationOptions } from "../query-options/create-add-snippet-mutation-options";
import { createUpdateSnippetMutationOptions } from "../query-options/create-update-snippet-mutation-options";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { createDeleteSnippetMutationOptions } from "../query-options/create-delete-snippet-mutation-options";

interface SnippetFormProps {
  open: boolean;
  onClose: () => void;
  snippet?: Snippet;
  className?: string;
}

export const SnippetForm: React.FC<SnippetFormProps> = ({
  open,
  onClose,
  snippet,
  className,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Languages>(
    Languages.JavaScript
  );
  const [code, setCode] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutateAsync: addSnippet } = useMutation(
    createAddSnippetMutationOptions()
  );
  const { mutateAsync: updateSnippet } = useMutation(
    createUpdateSnippetMutationOptions(snippet?.id || -1)
  );
  const { mutateAsync: deleteSnippet } = useMutation(
    createDeleteSnippetMutationOptions(snippet?.id || -1)
  );
  const { mode, systemMode } = useColorScheme();
  const themeStyle = getThemeStyle(mode, systemMode);

  const onRequest = (promise: Promise<unknown>) => {
    promise.then(() => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      onClose();
    });
  };

  useEffect(() => {
    if (snippet) {
      setCode(snippet.code);
      setSelectedLanguage(snippet.language);
    }
  }, [snippet]);

  return (
    <Dialog className={className} open={open} onClose={onClose}>
      <DialogTitle className="uppercase text-4xl text-center tracking-widest">
        {snippet ? "Edit snippet" : "Add new snippet"}
      </DialogTitle>
      <DialogContent className="space-y-4 p-5">
        <FormControl fullWidth>
          <InputLabel id="language">Age</InputLabel>
          <Select
            labelId="language"
            value={selectedLanguage}
            label="Age"
            onChange={(e) =>
              setSelectedLanguage(e.target.value as Languages)
            }
          >
            {Object.values(Languages).map((lang) => (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CodeMirror
          value={snippet?.code}
          editable={true}
          theme={themeStyle}
          extensions={[langExtentions[selectedLanguage]]}
          className="text-sm text-left w-[400px]"
          height="200px"
          onChange={(val) => setCode(val)}
        />
        {snippet ? (
          <>
            <Button
              variant="contained"
              onClick={() =>
                onRequest(updateSnippet({ code, language: selectedLanguage }))
              }
              disabled={
                code.length === 0 ||
                (code === snippet.code && selectedLanguage === snippet.language)
              }
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Save changes
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAlertOpen(true)}
              color="error"
              className="float-right"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              Delete snippet
            </Button>
            <AlertDialog
              open={isAlertOpen}
              title="Are you shure you want to delete this snippet?"
              text="This action can't be canceled"
              onConfirm={() => onRequest(deleteSnippet())}
              onClose={() => setIsAlertOpen(false)}
            />
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() =>
              onRequest(addSnippet({ code, language: selectedLanguage }))
            }
            disabled={code.length === 0}
          >
            <AddIcon className="w-4 h-4 mr-2" />
            Add snippet
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
