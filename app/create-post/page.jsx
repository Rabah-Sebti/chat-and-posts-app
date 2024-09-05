"use client";
import React, { useEffect, useState } from "react";
import Form from "@components/Form";
import { createPost, getPosts } from "@redux/slices/post";
import { useDispatch } from "@redux/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreatePost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    content: "",
    tag: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      dispatch(createPost(post)).then((status) => {
        debugger;
        if (status === 201) {
          toast("Post created", {
            closeButton: true,
            type: "success",
          });
          router.push("/home");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreatePost;
