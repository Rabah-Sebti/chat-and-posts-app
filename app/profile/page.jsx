"use client";
import { useAuthContext } from "@auth/useAuthContext";
import Profile from "@components/Profile";
import { deletePost, getPostsById } from "@redux/slices/post";
import { useDispatch, useSelector } from "@redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profilePosts } = useSelector((state) => state.post);
  const { user } = useAuthContext();
  const handleEdit = (post) => {
    router.push(`/update-post?id=${post.id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post ?");
    if (hasConfirmed) {
      try {
        dispatch(deletePost(post.id)).then((status) => {
          if (status === 200) {
            toast("Post deleted", {
              closeButton: true,
              type: "success",
            });
          }
        });
      } catch (error) {
        console.log("error delete", error);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getPostsById(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Profile
      name="My"
      data={profilePosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default ProfilePage;
