import { RegisterForm } from "@/features/register-form";
import Paper from "@mui/material/Paper";

export const RegisterPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <Paper className="w-[400px] h-[500px]">
        <RegisterForm />
      </Paper>
    </div>);
};