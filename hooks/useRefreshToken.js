import { setSession } from "../auth/utils";
import axios from "../utils/axios";
// import useAuth from './useAuth';

const useRefreshToken = () => {
  // const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/refresh-token",
      { refreshToken: localStorage.getItem("refreshToken") },
      {
        withCredentials: false,
      }
    );
    // setAuth(prev => {
    //     console.log(JSON.stringify(prev));
    //     console.log(response.data.accessToken);
    //     return { ...prev, accessToken: response.data.accessToken }
    // });
    const { access_token } = response.data;
    setSession(access_token);

    // return response.data.accessToken;
    return response;
  };
  return refresh;
};

export default useRefreshToken;
