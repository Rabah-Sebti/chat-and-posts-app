"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuthContext } from "@auth/useAuthContext";
import Icon from "./icon/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { formatDateMessage } from "@utils/utils";
import { useDispatch, useSelector } from "@redux/store";
import { addLikePost } from "@redux/slices/post";
import { Input } from "./ui/input";
import {
  createComment,
  getComments,
  getFirstComments,
} from "@redux/slices/comment";

const PostCard = ({ post, handleClick, handleEdit, handleDelete }) => {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.comment);
  const [comments, setComments] = useState([]);

  const hasLiked = post?.likes.includes(user?.id);
  const [isLiked, setLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(post.likes.length);

  const [showComment, setShowComment] = useState(false);
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const { _count } = post;
  const [totalComments, setTotalComments] = useState(_count.comments);
  const hasNextPageComment = currentPage * pageSize < totalComments;

  const handleLike = () => {
    dispatch(addLikePost(post.id, setLiked, setLikes, user.id));
  };

  const [comment, setComment] = useState("");
  const handleSubmitComment = () => {
    if (comment !== "") {
      const data = {
        content: comment,
        postId: post.id,
      };
      dispatch(createComment(data, setComments, setTotalComments));
      setComment("");
    }
  };

  const fetchNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    const data = {
      postId: post.id,
      page: currentPage + 1,
      pageSize: pageSize,
    };

    dispatch(getComments(data, setComments, setTotalComments));
  };
  const handleOpenCloseComments = () => {
    setShowComment(!showComment);
    if (!showComment) {
      const data = {
        postId: post.id,
        page: currentPage,
        pageSize: pageSize,
      };

      dispatch(getFirstComments(data, setComments, setTotalComments));
    } else {
      setCurrentPage(1);
    }
  };
  // useEffect(() => {
  //   const data = {
  //     postId: post.id,
  //     page: currentPage,
  //     pageSize: pageSize,
  //   };

  //   dispatch(getComments(data, setComments, setTotalComments));
  // }, [dispatch, currentPage, post.id]);

  return (
    <Card
      className="mb-4 break-inside-avoid w-full relative rounded-xl border-none card"
      style={{
        boxShadow: "2px 4px 8px 0 rgba(0, 0, 0, 5%)",
      }}
    >
      <CardHeader>
        <div className="flex flex-row space-x-2 flex-wrap items-center">
          <Image
            src={post?.author?.picture || "/user.png"}
            alt="profile"
            width={45}
            height={45}
            className="rounded-full object-contain"
          />

          <div>
            <CardTitle>{post.author?.firstName}</CardTitle>
            <CardDescription className="text-gray-500">
              {formatDateMessage(post.createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
        <p
          onClick={() => handleClick && handleClick(post.tag)}
          className="text-gray-400 cursor-pointer"
        >
          {post.tag}
        </p>
      </CardContent>
      {user?.id === post?.author?.id && pathname === "/profile" && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
              style={{
                position: "absolute",
                right: 10,
                top: 5,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="EllipsisVertical" size={16} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-1 bg-white rounded">
            <div className="flex-col">
              <div
                onClick={handleEdit}
                className="flex justify-between items-center hover:bg-slate-200 cursor-pointer p-2 rounded"
              >
                <p className="text-sm font-bold text-gray-700">Edit</p>
                <div className="flex-end">
                  <Icon name="Pencil" size={15} />
                </div>
              </div>
              <div
                className="flex justify-between items-center hover:bg-slate-200 cursor-pointer p-2 rounded"
                onClick={handleDelete}
              >
                <p className="text-sm font-bold text-gray-700">Delete</p>
                <div>
                  <Icon name="Trash2" color="red" size={15} />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Separator className=" bg-gray-200 h-[3px]" />
      <CardFooter className="flex flex-col items-start px-4 py-1">
        <div className="p-1 flex justify-between items-center w-full">
          <p className="text-[12px]">{likes} Likes</p>
          <p className="text-[12px]">{totalComments} Comments</p>
        </div>
        <Separator className="border my-1" />
        <div className="flex justify-between w-full">
          <div
            onClick={handleLike}
            className="p-1 rounded flex items-center space-x-1 cursor-pointer hover:bg-slate-200"
          >
            <div>
              <Icon
                name="ThumbsUp"
                size={18}
                color={isLiked ? "blue" : "black"}
              />
            </div>
            <span className="text-gray-700 text-[12px]">Like</span>
          </div>
          <div
            onClick={handleOpenCloseComments}
            className="p-1 rounded flex items-center space-x-1 ml-2 cursor-pointer hover:bg-slate-200"
          >
            <div>
              <Icon name="MessageSquare" size={18} />
            </div>
            <span className="text-gray-700 text-[12px]">comment</span>
          </div>
        </div>
        {showComment && (
          <div
            className={`w-full ${
              showComment
                ? "animate-in fade-in-0 duration-200 zoom-in-95"
                : "animate-out fade-out-0 duration-200 zoom-out-95"
            }`}
          >
            <div className="flex flex-row space-x-1 py-2 items-center w-full mt-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-3xl"
                placeholder="Comment"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
                onClick={handleSubmitComment}
              >
                Send
              </Button>
            </div>
            <div className="mt-2">
              {comments.map((comment, index) => {
                const currentDate = new Date(); // current date
                const targetDate = new Date(comment.createdAt); // your target date

                const timeDifference = currentDate - targetDate; // difference in milliseconds

                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                let dateCreate = "";
                if (days > 0) {
                  dateCreate = `${days}d`;
                } else if (hours > 0) {
                  dateCreate = `${hours}h`;
                } else if (minutes > 0) {
                  dateCreate = `${minutes}m`;
                } else {
                  dateCreate = `${seconds}s`;
                }

                return (
                  <div key={index} className="mt-2">
                    <div className="flex flex-row gap-2">
                      <div>
                        <Image
                          src={comment?.author?.image || "/user.png"}
                          alt="profile"
                          width={30}
                          height={30}
                          className="rounded-full object-contain"
                        />
                      </div>
                      <div className="glassmorphism py-1 px-5 w-[80%]">
                        <div className="flex flex-row space-x-1">
                          <p className="font-bold">
                            {comment?.author?.firstname}
                          </p>
                          <p className="text-gray-500">{dateCreate}</p>
                        </div>
                        <p
                          style={{
                            overflowWrap: "break-word",
                            maxWidth: "100%",
                          }}
                          className=""
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {hasNextPageComment && (
                <div className="flex justify-center">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                  ) : (
                    <button
                      onClick={() => fetchNextPage()}
                      className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                    >
                      Load more comments
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
