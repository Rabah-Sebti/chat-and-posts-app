"use client";
import React, { useState } from "react";
import PostCard from "./PostCard";
import { Home } from "lucide-react";
import Link from "next/link";
import ProfileSettingsDrawer from "./ProfileSettingsDrawer";
import InfoPersonneles from "./InfoPersonneles";
import EditPassword from "./EditPassword";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useSelector } from "@redux/store";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import DataNotFound from "./empty-data/DataNotFound";

const Profile = ({ data, handleEdit, handleDelete, name }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { isLoading } = useSelector((state) => state.post);
  const noData = data.length === 0 && !isLoading;
  return (
    <section className="w-full px-16 2xl:px-20 ">
      <div className="mt-6 flex justify-between items-center">
        <Link
          href="/home"
          className="h-[36px] w-[36px] rounded-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Home color="white" />
        </Link>
        <ProfileSettingsDrawer setActiveStep={setActiveStep} />
      </div>
      <h1
        className="font-bold text-center bg-gradient-to-r from-blue-500 via-blue-800 to-blue-500 bg-clip-text text-transparent"
        style={{
          fontSize: "60px",
        }}
      >
        {name} profile
      </h1>
      {activeStep === 0 && (
        <>
          {isLoading && <PostsSkeleton />}
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1300: 5 }}
            className=""
          >
            <Masonry
              style={{
                columnGap: "5px",
              }}
            >
              {data.map((post, index) => (
                <PostCard
                  key={index}
                  post={post}
                  handleEdit={() => handleEdit && handleEdit(post)}
                  handleDelete={() => handleDelete && handleDelete(post)}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          {noData && <DataNotFound />}
        </>
      )}
      {activeStep === 1 && <InfoPersonneles />}
      {activeStep === 2 && <EditPassword />}
    </section>
  );
};

export default Profile;
