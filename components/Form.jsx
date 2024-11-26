import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Home, Undo } from "lucide-react";
import { useDispatch } from "@redux/store";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@redux/slices/post";
import { toast } from "sonner";
import { Input } from "./ui/input";

const Form = ({ type, postReconcile, postId, isEdit }) => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    content: postReconcile?.content || "",
    tag: postReconcile?.tag || "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        dispatch(updatePost(post, postId)).then((status) => {
          if (status === 200) {
            toast("Post updated", {
              closeButton: true,
              type: "success",
            });
            router.push("/home");
          }
        });
      } else {
        dispatch(createPost(post)).then((status) => {
          if (status === 201) {
            toast("Post created", {
              closeButton: true,
              type: "success",
            });
            router.push("/home");
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-full mb-5 px-16 2xl:px-20 ">
      <div className="mt-6">
        {isEdit ? (
          <Link
            href="/profile"
            className="h-[36px] w-[36px] rounded-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Undo color="white" />
          </Link>
        ) : (
          <Link
            href="/home"
            className="h-[36px] w-[36px] rounded-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Home color="white" />
          </Link>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h1
          // style={{ fontSize: 70 }}
          className="text-3xl md:text-7xl font-bold text-start bg-gradient-to-r from-blue-500 via-blue-800 to-blue-500 bg-clip-text text-transparent"
        >
          {type} post
        </h1>
        <p className="font-bold text-[18px] md:text-[28px] text-gray-500">
          Share your post.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism px-6 py-2"
        >
          <label>
            <span className="font-semibold">Your post</span>
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="form_textarea"
              placeholder="Write your post"
              required
            />
          </label>
          <label>
            <span className="font-semibold">Tag</span>
            <Input
              value={post.tag}
              onChange={(e) => setPost({ ...post, tag: e.target.value })}
              className="w-full mt-3 p-2 rounded-lg"
              placeholder="Write your tag"
              required
            />
          </label>
          <Button className="default_btn" type="submit" disabled={submitting}>
            {type}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Form;
