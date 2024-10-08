import { UserPost } from "@/types/post";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { MoreInformation } from "@/components/ui/moreInformation";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/ui/loading";
import TextArea from "@/forms/components/textArea";
import { Button } from "@/components/ui/button";
import PostEditor from "@/forms/components/postEditor";
import { useComment } from "@/hooks/useComment";
import { Comment } from "@/types/comment";
import { useAuthContext } from "@/hooks/useAuthContext";
import { timeSince } from "@/lib/utils";
import PostInteraction from "@/components/ui/postInteraction";
import { scrollToSection } from "@/lib/utils";
import CommentInteraction from "@/components/ui/commentInteraction";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import UserInfo from "@/components/ui/userInfo";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
type CommunitySectionProps = {
  title: string;
  data: string | number | string[] | React.ReactNode;
};

function CommunitySection(props: CommunitySectionProps) {
  return (
    <div className="px-2 pt-2 space-y-1 ">
      <h2 className="text-lg font-black text-secondary">{props.title}</h2>
      <div className="pb-2 tracking-wider border-b-[1px] border-white">
        {props.data}
      </div>
    </div>
  );
}

type PostHeaderProps = {
  communityIcon: string;
  communityName: string;
  username: string;
  creationTime: string;
};

function PostHeader(props: PostHeaderProps) {
  const communityRef = useRef<HTMLAnchorElement | null>(null);

  function toggleTextHighlightOnHover() {
    communityRef.current
      ? communityRef.current.classList.toggle("text-secondary")
      : "";
  }

  return (
    <section className="flex items-center gap-2 pb-2 mx-4 mt-2 text-white border-b-2 border-sideNav">
      <Link to={`/community/${props.communityName}`}>
        <img
          src={props.communityIcon}
          className="w-12 h-12 border-2 rounded-full border-white/20"
          alt="community icon"
          onMouseEnter={toggleTextHighlightOnHover}
          onMouseLeave={toggleTextHighlightOnHover}
        />
      </Link>

      <div>
        <div className="space-x-2">
          <Link
            ref={communityRef}
            className="text-lg font-medium hover:text-secondary"
            to={`/community/${props.communityName}`}
          >
            {props.communityName}
          </Link>
          <span className="text-sm font-light text-white/50">
            {timeSince(props.creationTime)}
          </span>
        </div>
        <Link
          className="text-sm font-normal tracking-wide hover:text-secondary"
          to={`/user/${props.username}`}
        >
          {props.username}
        </Link>
      </div>
    </section>
  );
}

type PostBodyProps = {
  title: string;
  body: string;
  likes: number;
  dislikes: number;
  comments: number;
  postID: string | undefined;
  reactionScore: number;
  community: string;
  username: string;
};

function PostBody(props: PostBodyProps) {
  const postLink = `/community/${props.community}/${props.title}/${props.postID}`;
  return (
    <section className="px-4 space-y-4 ">
      <h1 className="max-w-4xl py-1 overflow-hidden text-4xl font-bold text-white break-words break-all ">
        {props.title}
      </h1>
      <div className="max-w-4xl bg-white border-2 border-gray-600 rounded">
        <div
          dangerouslySetInnerHTML={{ __html: props.body }}
          className="max-w-4xl p-3 mb-4 overflow-hidden prose text-black prose-pre:break-all md:prose-pre:break-words prose-pre:whitespace-pre-wrap prose-pre:max-w-lg prose-li:p-0 prose-li:m-0 prose-h1:text-lg prose-h1:m-0 prose-p:m-0 prose-p:p-0 prose-p:font-light prose-p:tracking-wide pose-h1:p-0 prose-ul:list-disc prose-li:marker:text-black"
        ></div>
        {props.postID && (
          <PostInteraction
            likes={props.likes}
            dislikes={props.dislikes}
            comments={props.comments}
            postID={props.postID}
            reactionScore={props.reactionScore}
            className="rounded-none"
            postLink={postLink}
            usernameOfPost={props.username}
            postTitle={props.title}
            postBody={props.body}
          />
        )}
        {!props.postID && (
          <p className="text-destructive">An error occurred with post stats.</p>
        )}
      </div>
    </section>
  );
}

type SingleCommentProps = {
  userIcon: string;
  username: string;
  commentID: string;
  created: string;
  comment: string;
  newComment?: boolean;
  likes: number;
  dislikes: number;
  isReply: boolean;
  replies: Comment[];
  className?: string;
  depth?: number;
  reactionScore: number;
};
function SingleComment(props: SingleCommentProps) {
  const [commentOpened, setCommentOpened] = useState(true);
  const navigate = useNavigate();
  const { communityName, post, id } = useParams();
  const { depth = 0 } = props;
  const [editedComment, setEditedComment] = useState<string | null>(null);

  const handleCommentEditVisualChange = (comment: string) => {
    setEditedComment(comment);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === "Space") {
      setCommentOpened(false);
    }
  };

  const handleTriggerKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === "Space") {
      setCommentOpened(true);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (depth === 4 && props.replies.length > 0) {
      e.stopPropagation();
      navigate(
        `/community/${communityName}/${post}/${id}/comment-thread/${props.commentID}`
      );
      return;
    }
    setCommentOpened((prev) => !prev);
  };
  return (
    <div className={cn("rounded bg-white/5", props.className)}>
      <Collapsible open={commentOpened} className="text-left ">
        <CollapsibleTrigger
          onKeyUp={handleTriggerKeyUp}
          onKeyDown={handleTriggerKeyDown}
          onClick={handleTriggerClick}
          className={`w-full ${props.replies.length > 0 ? "" : ""}`}
        >
          <div
            className={`${
              props.newComment ? "bg-gray-600" : ""
            } comment-left-line text-white pl-2 py-1 text-left`}
          >
            <div className="flex justify-between ">
              <UserInfo
                username={props.username}
                profileImg={props.userIcon}
                timeStamp={props.created}
                postOrComment={editedComment ? editedComment : props.comment}
                postOrCommentOpened={commentOpened}
              />
              {depth === 4 && props.replies.length > 0 ? (
                <span className="mr-2 material-symbols-outlined text-secondary">
                  open_in_new
                </span>
              ) : (
                <span
                  className={`${commentOpened ? "rotate-180" : ""} ${
                    props.replies.length > 0 ? "" : "hidden"
                  } transition-transform material-symbols-outlined text-secondary h-5 w-5 mr-2 `}
                >
                  keyboard_arrow_down
                </span>
              )}
            </div>

            <CommentInteraction
              likes={props.likes}
              dislikes={props.dislikes}
              commentID={props.commentID}
              reactionScore={props.reactionScore}
              username={props.username}
              comment={props.comment}
              commentChangeFunction={handleCommentEditVisualChange}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {props.replies.map((reply, index) => {
            if (reply.profile.profileImg !== undefined) {
              return (
                <div
                  className={`pl-4 md:pl-6 lg:pl-8  ${
                    index > 0 ? "" : "comment-curve-connection"
                  }`}
                >
                  {reply && depth < 4 && (
                    <SingleComment
                      key={index}
                      userIcon={reply.profile.profileImg.toString()}
                      username={reply.profile.account?.username || "error"}
                      commentID={reply._id}
                      created={reply.created}
                      comment={reply.comment}
                      likes={reply.likes}
                      dislikes={reply.dislikes}
                      isReply={true}
                      replies={reply.replies ? reply.replies : []}
                      depth={depth + 1}
                      reactionScore={reply.reactionScore || 0}
                    />
                  )}
                </div>
              );
            }
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function CommentSection({
  comments,
  newComment,
}: {
  comments: Comment[];
  newComment: Comment | null;
}) {
  return (
    <section className="mx-4 space-y-3">
      {newComment && (
        <SingleComment
          userIcon={newComment.profile.profileImg.toString()}
          username={newComment.profile.account?.username || ""}
          created={newComment.created}
          comment={newComment.comment}
          newComment={newComment ? true : false}
          likes={0}
          dislikes={0}
          commentID={newComment._id}
          isReply={newComment.isReply}
          replies={newComment.replies}
          reactionScore={newComment.reactionScore || 0}
          key={newComment._id}
        />
      )}
      {comments &&
        comments.map((comment: Comment, index) => {
          if (!comment.isReply) {
            return (
              <SingleComment
                key={index}
                userIcon={comment.profile.profileImg.toString()}
                username={comment.profile.account?.username || ""}
                created={comment.created}
                comment={comment.comment}
                likes={comment.likes}
                dislikes={comment.dislikes}
                commentID={comment._id}
                isReply={comment.isReply}
                reactionScore={comment.reactionScore || 0}
                replies={comment.replies}
              />
            );
          }
        })}
    </section>
  );
}

function SinglePost() {
  const { communityName, post, id } = useParams();
  const [userPost, setUserPost] = useState<UserPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [textAreaClick, setTextAreaClick] = useState(false);
  const {
    loading: commentLoading,
    fetchError: commentFetchError,
    createComment,
    newComment,
  } = useComment();
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetch(`${import.meta.env.VITE_LIMELEAF_BACKEND_URL}/api/posts/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setFetchError(true);
          throw new Error("Server error");
        }
        setUserPost(data);
      })
      .catch(() => {
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  }, [communityName, post]);

  useEffect(() => {
    switch (true) {
      case commentFetchError === 200:
        setCommentError("");
        return;
      case commentFetchError === 401 || commentFetchError === 403:
        setCommentError("Invalid credentials, please log back in.");
        return;
      case commentFetchError === 400:
        setCommentError("Incorrect comment formatting.");
        return;
      case commentFetchError === 500:
        setCommentError("Server error, try again later.");
        return;
    }
  }, [commentFetchError]);

  useEffect(() => {
    if (location.hash === "#comments") {
      setTimeout(() => {
        scrollToSection("comments");
      }, 1500);
    }
  }, [location]);

  function handleSetComment(comment: string) {
    setCommentError("");
    setComment(comment);
  }

  function handleSubmitComment() {
    const isCommentEmpty = (): boolean => {
      const trimmedComment = comment.trim();
      const emptyContentRegex = /^<p>\s*<\/p>$/;
      return !trimmedComment || emptyContentRegex.test(trimmedComment);
    };

    if (isCommentEmpty()) {
      setCommentError("Comment be at least 2 characters long.");
    } else {
      createComment({ comment: comment, isReply: false }, id);
      setComment("");
      setTextAreaClick(false);
    }
  }

  return (
    <div className="flex mb-4">
      {loading && <Loading />}
      {fetchError && (
        <div className="flex gap-5">
          <h1 className="flex-1 block p-4 mx-auto text-4xl font-bold text-white">
            Server error, try again later.
          </h1>
          <MoreInformation defaultInformation={true}>
            <></>
          </MoreInformation>
        </div>
      )}
      {userPost && (
        <>
          <div className="flex-1">
            <div className="space-y-5 ">
              <PostHeader
                communityIcon={userPost.community.communityIcon.toString()}
                communityName={userPost.community.name}
                username={userPost.author.account.username}
                creationTime={userPost.created}
              />
              <PostBody
                title={userPost.title}
                body={userPost.body}
                likes={userPost.likes}
                dislikes={userPost.dislikes}
                community={userPost.community.name}
                comments={
                  typeof userPost.comments === "object"
                    ? userPost.comments.length
                    : userPost.comments
                }
                postID={id}
                reactionScore={userPost.reactionScore}
                username={userPost.author.account.username}
              />
              <div className="sr-only" id="comments"></div>
              <form action="" className="max-w-2xl mx-4">
                {!textAreaClick && (
                  <>
                    {user && (
                      <>
                        <TextArea
                          className={`${
                            textAreaClick ? "hidden" : "rounded-full"
                          } px-2 `}
                          label={"Comment"}
                          id={"comment"}
                          onClick={() => {
                            setTextAreaClick(true);
                          }}
                          error={false}
                        />
                        <p className="text-destructive">
                          {commentFetchError && <p>*{commentError}</p>}
                        </p>
                      </>
                    )}
                    {!user && (
                      <h1 className="text-xl font-bold text-white">
                        You need to be logged in to leave a comment.
                      </h1>
                    )}
                  </>
                )}

                {textAreaClick && (
                  <>
                    <label
                      className="text-xl font-medium text-white"
                      htmlFor={"comment"}
                    >
                      Comment
                    </label>
                    <div className="bg-white rounded ">
                      <PostEditor
                        className="pb-4 min-h-20 cursor-text"
                        setBody={handleSetComment}
                        id={"comment"}
                      />
                    </div>
                    <p className="text-destructive">
                      {commentError && <>*{commentError}</>}
                    </p>
                    <div className="flex justify-end gap-2 my-2 ">
                      <Button
                        onClick={() => {
                          setTextAreaClick(false);
                          setCommentError("");
                          setComment("");
                        }}
                        type="button"
                        variant={"destructive"}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitComment} type="button">
                        {commentLoading ? "Loading..." : "Submit"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
              <CommentSection
                comments={
                  typeof userPost.comments === "object" ? userPost.comments : []
                }
                newComment={newComment}
              />
            </div>
          </div>

          <div className="hidden mx-10 lg:block">
            <MoreInformation defaultInformation={fetchError}>
              <>
                <div className="px-2 pt-2">
                  <div className="flex items-center gap-2 pb-2">
                    <img
                      src={userPost.community.communityIcon.toString()}
                      alt={userPost.community.name + " icon"}
                      className="w-16 h-16 border-2 rounded-full border-white/20"
                    />
                    <Link to={`/community/${userPost.community.name}`}>
                      <h3 className="mb-2 text-4xl font-black text-center text-secondary hover:opacity-80">
                        {userPost.community.name}
                      </h3>
                    </Link>
                  </div>

                  <p className="pb-2 border-b-[1px] border-white">
                    {userPost.community.description}
                  </p>
                </div>
                <CommunitySection
                  title={"Followers"}
                  data={userPost.community.followers}
                />
                <CommunitySection
                  title={"Tags"}
                  data={
                    typeof userPost.community.tags === "object" && (
                      <div className="flex flex-wrap gap-2">
                        {userPost.community.tags.map((tags: string) => (
                          <Badge key={tags}>{tags}</Badge>
                        ))}
                      </div>
                    )
                  }
                />
                <CommunitySection
                  title={"Created"}
                  data={userPost.community.created}
                />
              </>
            </MoreInformation>
          </div>
        </>
      )}
    </div>
  );
}

export { SinglePost, SingleComment };
