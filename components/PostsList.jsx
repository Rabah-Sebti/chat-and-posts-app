import React, { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import DataNotFound from "./errors/DataNotFound";
import PostCard from "./PostCard";
import DataNotFound from "./empty-data/DataNotFound";

export default function PostsList({
  data,
  handleClick,
  hasNextPage,
  fetchData,
}) {
  const isNotFound = data.length === 0;
  // const loadMore = useCallback(() => {
  //   if (hasNextPage) {
  //     fetchData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   const timeout = loadMore();
  //   return () => clearTimeout(timeout);
  // }, [loadMore]);
  return (
    <div>
      {isNotFound && <DataNotFound />}
      <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={hasNextPage}
      >
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mt-2 py-4">
          {data.map((post, index) => (
            <PostCard key={index} post={post} handleClick={handleClick} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
