import { Skeleton } from "@components/ui/skeleton";
import React from "react";

function PostsSkeleton() {
  return (
    <div className="px-2 py-2 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostsSkeleton;
