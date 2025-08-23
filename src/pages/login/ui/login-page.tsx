import { LoginForm } from "@/features/login-form";
import Paper from "@mui/material/Paper";

export const LoginPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <Paper className="w-[300px] h-[500px]">
        <LoginForm />
      </Paper>
    </div>
  );
};
