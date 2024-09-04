// routes
// import { PATH_AUTH } from "../routes/paths";
// utils
import useSWR from "swr";
import axios from "../utils/axios";

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  return true;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;
  // const timeLeft = currentTime + 60000 - currentTime; // ~10s
  // if (timeLeft > 0 && timeLeft < 2147483647) {
  //   clearTimeout(expiredTimer);

  //   expiredTimer = setTimeout(async () => {
  //     // alert("Token expired");
  //     const response = await axios.post("/api/v1/auth/refresh-token");
  //     const { access_token } = response.data;
  //     setSession(access_token);

  //     // localStorage.removeItem("accessToken");

  //     // window.location.href = PATH_AUTH.login;
  //   }, timeLeft);
  // }
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken); //
    // tokenExpired(exp);
  } else {
    sessionStorage.removeItem("accessToken");

    delete axios.defaults.headers.common.Authorization;
  }
};

export function useUser() {
  const fetcher = (...args) =>
    fetch(...args, {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_REACT_APP_HOST_API_KEY}/api/client`,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
