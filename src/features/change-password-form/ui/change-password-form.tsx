import { useForm } from "react-hook-form";
import { passwordSchema, type PasswordFormValues } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createChangePasswordMutationOptions } from "@/features/change-password-form/query-options/create-change-password-mutation-options";

export const ChangePasswordForm = () => {
  const { mutateAsync: changePassword, isPending } = useMutation(
    createChangePasswordMutationOptions()
  );
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async ({
    oldPassword,
    newPassword,
  }: PasswordFormValues) => {
    changePassword({ oldPassword, newPassword })
      .then(() => reset())
      .catch(() => setFocus("oldPassword"));
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
          Change password
        </h2>
        <FormControl
          className="w-full"
          variant="standard"
          error={!!errors["oldPassword"]}
        >
          <InputLabel htmlFor="oldPassword">Old password</InputLabel>
          <Input
            id="oldPassword"
            {...register("oldPassword")}
            type="password"
          />
          {errors["oldPassword"] && (
            <FormHelperText id="component-error-text">
              {errors["oldPassword"].message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className="w-full"
          variant="standard"
          error={!!errors["newPassword"]}
        >
          <InputLabel htmlFor="newPassword">New password</InputLabel>
          <Input
            id="newPassword"
            {...register("newPassword")}
            type="password"
          />
          {errors["newPassword"] && (
            <FormHelperText id="component-error-text">
              {errors["newPassword"].message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className="w-full"
          variant="standard"
          error={!!errors["confirmPassword"]}
        >
          <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
          <Input
            id="confirmPassword"
            {...register("confirmPassword")}
            type="password"
          />
          {errors["confirmPassword"] && (
            <FormHelperText id="component-error-text">
              {errors["confirmPassword"].message}
            </FormHelperText>
          )}
        </FormControl>
        <Button type="submit" disabled={isPending} variant="contained">
          Confirm
        </Button>
      </form>
    </Card>
  );
};
