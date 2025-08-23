import { ChangePasswordForm } from "@/features/change-password-form";
import { Paper } from "@mui/material"


export const EditProfile = () => {

  if (user === null) {
    return null;
  }
  
  return (
    <Paper className="w-[80%] p-16 flex flex-wrap justify-around space-y-4">
      <h4 className="w-full text-center tracking-widest">Edit your profile</h4>
      <ChangePasswordForm/>
    </Paper>
  );
}
