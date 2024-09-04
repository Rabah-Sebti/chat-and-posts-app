"use client";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "./useAuthContext";
import LoadingScreen from "@components/LoadingScreen";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const router = useRouter();

  const { isAuthenticated, isInitialized } = useAuthContext();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  return <> {children} </>;
}
