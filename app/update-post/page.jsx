"use client";
import Form from "@components/Form";
import { getSinglePost } from "@redux/slices/post";
import { useDispatch, useSelector } from "@redux/store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const UpdatePost = () => {
  const dispatch = useDispatch();
  const { post: postReconcile } = useSelector((state) => state.post);
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  useEffect(() => {
    if (postId) {
      dispatch(getSinglePost(postId));
    }
  }, [dispatch, postId]);
  return (
    <>
      {postReconcile && (
        <Form
          type="Update"
          postReconcile={postReconcile}
          postId={postId}
          isEdit
        />
      )}
    </>
  );
};

export default UpdatePost;
