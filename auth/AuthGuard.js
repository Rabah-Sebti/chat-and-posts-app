"use client";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { usePathname, useRouter } from "next/navigation";
import LoginPage from "@app/login/page";
import LoadingScreen from "@components/LoadingScreen";

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  const { push } = useRouter();
  const pathname = usePathname();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <LoginPage />;
  }

  return <> {children} </>;
}
