import Loading from "../components/Loading.tsx";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { PublicUser } from "../routes/models/user.ts";

export default function LeaderboardPage() {
  const { data, error, loading } = useGraphQLQuery<{ users: PublicUser[] } | null>(
    `{
      users {
        name
        icon
        totalNetWorth
      }
    }`
  );
  const sortedUsers = data?.users?.sort((a, b) => {
    return b.totalNetWorth - a.totalNetWorth;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-1/2 mx-auto mt-20 bg-custom-bg p-10 shadow-lg rounded">
      {
        sortedUsers?.map((user, index) => {
          return (
            <div className="flex justify-between items-center p-5 border-b-2 border-dashed border-black">
              <div className="flex items-center">
                <div className="text-custom-light-main font-bold text-xl mr-5">
                  {index + 1}.
                </div>
                <img
                  className="w-10 h-10 rounded-full mx-5 z-10 border-2 shadow border-custom-light-main"
                  src={user.icon}
                />
                <div>
                  <h1 className="text-custom-light-main text-lg">
                    {user.name}
                  </h1>
                </div>
              </div>
              <div className="font-bold text-custom-light-main">
                <span className="text-custom-dark-green">
                  {user?.totalNetWorth
                    ? " $" + user.totalNetWorth.toFixed(2)
                    : " $0.00"}
                </span>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
