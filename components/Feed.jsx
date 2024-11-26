"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@hooks/use-debounce";
import axiosInstance from "@utils/axios";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import useSWRInfinite from "swr/infinite";
import PostsList from "./PostsList";

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

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const debouncedSearchTextFunction = useDebounce((value) => {
    setDebouncedSearchText(searchText);
  });
  const pageSize = 10;
  const getKey = (pageIndex, previousPageData) => {
    // Stop fetching when the last page returns an empty array
    if (previousPageData && previousPageData.posts.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_REACT_APP_HOST_API_KEY}/api/v1/posts`,
      {
        search: debouncedSearchText, // You can also pass dynamic filters
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

  const handleClick = (tagId) => {};
  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(value);
    debouncedSearchTextFunction(value);
  };

  const posts = data ? data.flatMap((page) => page.posts) : []; // Flatten paginated responses

  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined";
  const isEmpty = data?.[0]?.posts?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts?.length < pageSize);

  const next = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1); // Load next page
    }
  };

  return (
    <section className="mb-4">
      <Input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(e) => onChange(e)}
        className="p-2 rounded-xl"
      />
      {isLoading && <PostsSkeleton />}
      {!isLoading && searchText ? (
        <PostsList
          data={posts || []}
          handleClick={handleClick}
          hasNextPage={!isReachingEnd && !isLoadingMore}
          fetchData={next}
        />
      ) : (
        !isLoading && (
          <PostsList
            data={posts || []}
            handleClick={handleClick}
            hasNextPage={!isReachingEnd && !isLoadingMore}
            fetchData={next}
          />
        )
      )}
    </section>
  );
};

export default Feed;
