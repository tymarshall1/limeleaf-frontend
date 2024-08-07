import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Community } from "@/types/community";
import { useNavigate } from "react-router-dom";
import { useToggleFollow } from "./useToggleFollow";

export const useCreateCommunity = () => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { toggleFollow } = useToggleFollow();
  async function createCommunity(community: Community) {
    const accessToken = localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : "undefined";

    if (accessToken === "undefined") {
      setFetchError(401);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("communityName", community.name);
    formData.append("description", community.description);
    formData.append("communityIcon", community.communityIcon);
    formData.append("communityBG", community.communityBG);
    for (let i = 0; i < community.tags.length; i++)
      formData.append("tags[]", community.tags[i]);

    try {
      setFetchError(null);
      const response = await fetch(
        `${import.meta.env.VITE_LIMELEAF_BACKEND_URL}/api/community/create`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(response.status.toString());
      } else {
        const json = await response.json();
        setLoading(false);
        toggleFollow(json.name);
        navigate(`/community/${json.name}`);
        toast({ title: `Community '${json.name}' has been created ` });
      }
    } catch (err) {
      if (err instanceof Error) {
        setLoading(false);
        if (isNaN(Number(err.message))) {
          setFetchError(500);
          return;
        }
        setFetchError(Number(err.message));
      }
    }
  }

  return { loading, fetchError, createCommunity };
};
