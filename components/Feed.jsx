"use client";
import React, { useCallback, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PostCard from "./PostCard";
import { Input } from "./ui/input";
import { useDebounce } from "@hooks/use-debounce";
import useSWR from "swr";
import axiosInstance from "@utils/axios";
import PostsSkeleton from "./skeletons/PostsSkeleton";

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

const PostsCardList = ({ data, handleClick, hasNextPage, fetchData }) => {
  return (
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1300: 5 }}
        className=""
      >
        <Masonry
          className=""
          style={{
            columnGap: "5px",
          }}
        >
          {data?.length > 0 &&
            data.map((post, index) => (
              <PostCard key={index} post={post} handleClick={handleClick} />
            ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  // const [newPosts, setNewPosts] = useState([]);
  const debouncedSearchTextFunction = useDebounce((value) => {
    setDebouncedSearchText(searchText);
  });

  // const page = 1;
  const pageSize = 3;

  const { data, error, isLoading } = useSWR(
    [
      "http://localhost:3333/api/v1/posts",
      {
        search: debouncedSearchText,
        page,
        pageSize,
      },
      // setNewPosts,
    ],
    ([url, params]) => fetcher(url, params)
  );

  const totalRecords = data?.totalPosts;

  const hasNextPage = page < Math.ceil(totalRecords / pageSize);
  const fetchData = () => {
    setPage((prev) => prev + 1);
  };
  const handleClick = (tagId) => {};
  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(value);
    debouncedSearchTextFunction(value);
  };

  return (
    <section className="mb-4">
      <Input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(e) => onChange(e)}
        className="p-2 rounded"
      />
      {isLoading && <PostsSkeleton />}
      {!isLoading && searchText ? (
        <PostsCardList
          data={data?.posts || []}
          handleClick={handleClick}
          hasNextPage={hasNextPage}
          fetchData={fetchData}
        />
      ) : (
        !isLoading && (
          <PostsCardList
            data={data?.posts || []}
            handleClick={handleClick}
            hasNextPage={hasNextPage}
            fetchData={fetchData}
          />
        )
      )}
    </section>
  );
};

export default Feed;
