import { ChangePasswordForm } from "@/features/change-password-form";
import { ChangeUsernameForm } from "@/features/change-username-form";
import { createAuthQueryOptions } from "@/shared/query-options";
import { Paper } from "@mui/material"
import { useSuspenseQuery } from "@tanstack/react-query";


export const EditProfile = () => {
  const { data: user } = useSuspenseQuery(createAuthQueryOptions());

  if (user === null) {
    return null;
  }
  
  return (
    <Paper className="w-[80%] p-16 flex flex-wrap justify-around space-y-4">
      <h4 className="w-full text-center tracking-widest">Edit your profile</h4>
      <ChangeUsernameForm userId={user.id} currentUsername={user.username} />
      <ChangePasswordForm/>
    </Paper>
  );
}
