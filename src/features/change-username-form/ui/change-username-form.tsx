import { useForm } from "react-hook-form";
import { usernameSchema, type UsernameFormValues } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createChangeUsernameMutationOptions } from "@/features/change-username-form/query-options/create-change-username-mutation-options";
import { useState } from "react";
import {
  createAuthQueryOptions,
  createUserQueryOptions,
} from "@/shared/query-options";

interface ChangeUsernameFormProps {
  userId: number;
  currentUsername: string;
}

export const ChangeUsernameForm: React.FC<ChangeUsernameFormProps> = ({
  userId,
  currentUsername,
}) => {
  const [username, setUsername] = useState<string>(currentUsername);
  const { mutateAsync: changeUsername, isPending } = useMutation(
    createChangeUsernameMutationOptions()
  );
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: currentUsername,
    },
  });

  const onSubmit = async (data: UsernameFormValues) => {
    changeUsername(data)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: createUserQueryOptions(userId).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: createAuthQueryOptions().queryKey,
        });
      })
      .catch(() => {
        setUsername(currentUsername);
        setFocus("username");
      });
  };

  return (
    <Card elevation={3} className="max-w-[40%] h-fit space-y-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }}
        className="h-full p-4 flex flex-col justify-center items-center space-y-8"
      >
        <h2 className="text-xl font-bold tracking-[1rem] text-center -mr-4">
          Change username
        </h2>
        <FormControl
          className="w-full"
          variant="standard"
          error={!!errors["username"]}
        >
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            id="username"
            {...register("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors["username"] && (
            <FormHelperText id="component-error-text">
              {errors["username"].message}
            </FormHelperText>
          )}
        </FormControl>
        <Button
          type="submit"
          disabled={isPending || currentUsername === username}
          variant="contained"
        >
          Confirm
        </Button>
      </form>
    </Card>
  );
};
