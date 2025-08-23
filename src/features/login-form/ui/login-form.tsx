import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import { NavLink, useNavigate } from "react-router";
import { userSchema, type UserFormValues } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAuthQueryOptions,
} from "@/shared/query-options";
import { createLoginMutationOptions } from "../query-options/create-login-muataion-options";

export const LoginForm = () => {
  const {
    mutateAsync: login,
    isPending,
  } = useMutation(createLoginMutationOptions());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    login(data)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: createAuthQueryOptions().queryKey,
        });
        navigate("/");
      })
      .catch(() => setFocus("username"));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
      className="h-full p-4 flex flex-col justify-center items-center space-y-8"
    >
      <h2 className="text-4xl font-black tracking-[2rem] -mr-8">Login</h2>
      <FormControl
        className="w-full"
        variant="standard"
        error={!!errors["username"]}
      >
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input {...register("username")} />
        {errors["username"] && (
          <FormHelperText id="component-error-text">
            {errors["username"].message}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl
        className="w-full"
        variant="standard"
        error={!!errors["password"]}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input {...register("password")} type="password" />
        {errors["password"] && (
          <FormHelperText id="component-error-text">
            {errors["password"].message}
          </FormHelperText>
        )}
      </FormControl>
      <Button type="submit" disabled={isPending} variant="contained">
        Confirm
      </Button>
      <Link component={NavLink} className="flex text-center" to="/register">
        Don't have an account yet?
      </Link>
    </form>
  );
};
