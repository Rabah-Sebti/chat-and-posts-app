"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-blue-700">
        Something went wrong!
      </h2>
      <button
        className="default_btn"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
