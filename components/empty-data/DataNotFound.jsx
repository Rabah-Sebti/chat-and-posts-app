import Image from "next/image";
import React from "react";

function DataNotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 mt-2">
      <Image src="/assets/no-data.png" alt="404" width={160} height={160} />
      <p className="text-fluid-4xl font-bold text-blue-700">No results found</p>
    </div>
  );
}

export default DataNotFound;
