import axios from "axios";
// config
import { HOST_API_KEY } from "../config-global";
// import useRefreshToken from "@hooks/useRefreshToken";
// import { setSession } from "@auth/utils";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  // (error) =>
  //   Promise.reject(
  //     (error.response && error.response.data) || "Something went wrong"
  //   )
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      // const response = await refresh();
      // if (response.status === 200) {
      //   prevRequest.headers[
      //     "Authorization"
      //   ] = `Bearer ${response.data.accessToken}`;
      //   setSession(response.data.accessToken);
      //   return axiosInstance(prevRequest);
      //   // return response.data.accessToken;
      // } else {
      // window.location.href = "/login"; // Redirect to the login page
      // localStorage.removeItem("refreshToken");
      // sessionStorage.removeItem("accessToken");
      // }
      // .then((response) => {
      //   if (response.status === 200) {
      //     prevRequest.headers[
      //       "Authorization"
      //     ] = `Bearer ${response.data.accessToken}`;
      //     setSession(newAccessToken);
      //     return axiosInstance(prevRequest);
      //     // return response.data.accessToken;
      //   } else {
      //     window.location.href = "/login"; // Redirect to the login page
      //     localStorage.removeItem("refreshToken");
      //     sessionStorage.removeItem("accessToken");
      //   }
      // });
      // prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      // setSession(newAccessToken);
      // return axiosInstance(prevRequest);
    }
    // if (error?.response?.status === 403) {
    //   // Handle the scenario when the user is not authorized to access a resource
    //   // For example, you can redirect the user to the login page
    //   // Replace the following line with your desired redirection logic
    //   window.location.href = "/login"; // Redirect to the login page
    //   localStorage.removeItem("refreshToken");
    //   sessionStorage.removeItem("accessToken");
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
