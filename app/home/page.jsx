import PostsSkeleton from "@components/skeletons/PostsSkeleton";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const Feed = dynamic(() => import("@components/Feed"), {
  loading: () => <PostsSkeleton />,
});

const Dashboard = async () => {
  return (
    <div className="mx-16 2xl:mx-20 mt-24">
      <Feed />
    </div>
  );
};

export default Dashboard;
