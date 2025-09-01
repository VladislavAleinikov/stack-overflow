import { UserInfo } from "@/widgets/user-info/";
import { createAuthQueryOptions } from "@/shared/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { EditProfile } from "@/widgets/edit-profile";
import { Suspense } from "react";

interface UserPageProps {
  isThisUser?: boolean;
}
export const UserPage: React.FC<UserPageProps> = ({ isThisUser }) => {
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const params = useParams();
  
  return (
    <div className="h-full flex flex-col justify-center items-center space-y-12">
      <Suspense fallback={<UserInfo.Skeleton />}>
        <UserInfo
          userId={isThisUser ? authUser!.id : parseInt(params.id!)}
        />
      </Suspense>
      {isThisUser && <EditProfile />}
    </div>
  );
};
