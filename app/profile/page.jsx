"use client";
import React, { useEffect } from "react";
import { useAuthContext } from "@auth/useAuthContext";
import Profile from "@components/Profile";
import { deletePost, getPostsById } from "@redux/slices/post";
import { useDispatch, useSelector } from "@redux/store";
import { useRouter } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import axiosInstance from "@utils/axios";

const fetcher = (url, params) =>
  axiosInstance
    .get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      params,
    })
    .then((res) => {
      // setNewPosts((prev) => [...prev, ...res.data.posts]);
      return res.data;
    });

const pageSize = 10;

const ProfilePage = () => {
  const { user } = useAuthContext();

  const getKey = (pageIndex, previousPageData) => {
    // Stop fetching when the last page returns an empty array
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_REACT_APP_HOST_API_KEY}/api/v1/posts/${user.id}/user-posts`,
      {
        // search: debouncedSearchText, // You can also pass dynamic filters
        page: pageIndex, // Start pages from 1
        pageSize,
      },
    ];
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false, // Prevent re-fetching when the window refocuses
    }
  );
  const posts = data ? data.flatMap((page) => page) : []; // Flatten paginated responses

  const router = useRouter();
  const dispatch = useDispatch();
  const { profilePosts } = useSelector((state) => state.post);
  const handleEdit = (post) => {
    router.push(`/update-post?id=${post.id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post ?");
    if (hasConfirmed) {
      try {
        dispatch(deletePost(post.id));
      } catch (error) {
        console.log("error delete", error);
      }
    }
  };
  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined";
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < pageSize);

  const next = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1); // Load next page
    }
  };
  // useEffect(() => {
  //   if (user?.id) {
  //     dispatch(getPostsById(user.id));
  //   }
  // }, [dispatch, user?.id]);

  return (
    <Profile
      name="My"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      fetchData={next}
      hasNextPage={!isReachingEnd && !isLoadingMore}
      isLoading={isLoading}
    />
  );
};

export default ProfilePage;
