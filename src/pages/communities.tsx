import { Button } from "@/components/ui/button";
import Error from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import useFetch from "@/hooks/useFetch";
import { Community } from "@/types/community";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToggleFollow } from "@/hooks/useToggleFollow";
function SingleCommunity({
  bg,
  name,
  icon,
  followers,
  description,
  userFollowsCommunity,
}: {
  bg: string;
  name: string;
  icon: string;
  followers: number;
  description: string;
  userFollowsCommunity: boolean;
}) {
  const { loading, toggleFollow } = useToggleFollow();
  const [followClick, setFollowClick] = useState(false);
  const [followerCount, setFollowerCount] = useState(followers);
  const [followText, setFollowText] = useState(
    userFollowsCommunity ? "Follow" : "Unfollow"
  );

  useEffect(() => {
    setFollowText(followText === "Unfollow" ? "Follow" : "Unfollow");
  }, [followClick]);

  return (
    <Link
      to={`/community/${name}`}
      className="hover:border-secondary border-[1px] border-white/20 rounded  text-white space-y-2 max-h-[420px]"
    >
      <img
        className="w-full rounded max-h-72"
        src={bg}
        alt={name + " background image"}
      />
      <div className="flex items-center gap-2 p-1">
        <img
          className="h-10 w-10 border-[1px] border-white/20 rounded-full"
          src={icon}
          alt={name + " icon"}
        />
        <h2 className="text-xl font-bold">{name}</h2>
        <h3 className="font-light text-white/80 text-md">
          {`${followerCount} ${
            followerCount === 1 ? " follower" : " followers"
          }`}
        </h3>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFollow(name);
            setFollowClick(!followClick);
            setFollowerCount((prev) => {
              if (followText === "Unfollow") {
                return prev - 1;
              }
              return prev + 1;
            });
          }}
          className="h-6"
          variant={"secondary"}
        >
          {followText}
        </Button>
        {loading && <Loading />}
      </div>
      <p className="px-2 pb-3 overflow-hidden font-normal max-h-40">
        {description}
      </p>
    </Link>
  );
}

function FindCommunities() {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [communities, setCommunities] = useState<Community[]>([]);
  const [noMoreCommunities, setNoMoreCommunities] = useState(false);
  const { isLoading, error, responseData, fetchData } = useFetch<Community[]>(
    `${import.meta.env.VITE_LIMELEAF_BACKEND_URL}/api/community/popular?page=${
      pagination.page
    }&limit=${pagination.limit}`,
    "GET"
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (pagination.page === 1) return;
    fetchData();
  }, [pagination]);

  useEffect(() => {
    if (responseData) {
      setCommunities((prevCommunities) => [
        ...prevCommunities,
        ...responseData,
      ]);

      if (responseData.length !== pagination.limit) {
        setNoMoreCommunities(true);
        return;
      }
    }
  }, [responseData]);

  const handleSeeMore = () => {
    if (noMoreCommunities) return;
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  const handleSeeLess = () => {
    setCommunities(communities.slice(0, 10));
    setNoMoreCommunities(false);
    setPagination({ page: 1, limit: 10 });
  };

  return (
    <div className="p-2 pb-4 space-y-4">
      <div className="py-5 flex items-start justify-center rounded bg-sideNav border-[1px] border-white/20">
        <h1 className="text-4xl font-bold text-white">Popular Communities</h1>
      </div>
      {error && <Error />}
      {isLoading && <Loading />}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
        {communities &&
          communities.map((community, index) => {
            return (
              <SingleCommunity
                key={index}
                bg={
                  typeof community.communityBG === "string"
                    ? community.communityBG
                    : ""
                }
                name={community.name}
                icon={community.communityIcon.toString()}
                followers={
                  typeof community.followers === "number"
                    ? community.followers
                    : 0
                }
                description={community.description}
                userFollowsCommunity={community.followsCommunity || false}
              />
            );
          })}
        <div className="block mx-auto md:col-span-2">
          {noMoreCommunities ? (
            <Button onClick={handleSeeLess}>See Less </Button>
          ) : (
            <Button onClick={handleSeeMore}>See More </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindCommunities;
