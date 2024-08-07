import { ProfileFields } from "./profileFields";
import { UserPost } from "./post";
export type Comment = {
  profile: ProfileFields;
  comment: string;
  post: UserPost;
  replies: Comment[];
  created: string;
  likes: number;
  dislikes: number;
  isReply: boolean;
  reactionScore?: number;
  _id: string;
};
