"use client";
import PropTypes from "prop-types";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
// utils
import axios from "../utils/axios";
import localStorageAvailable from "../utils/localStorageAvailable";
//
import { setSession } from "./utils";

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: "",
};

const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGIN") {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
      accessToken: action.payload.accessToken,
      isInitialized: true,
    };
  }
  if (action.type === "REGISTER") {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
      isInitialized: true,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  if (action.type === "UPDATE_USER") {
    return {
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable
        ? sessionStorage.getItem("accessToken")
        : "";

      if (accessToken) {
        setSession(accessToken);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_HOST_API_KEY}/api/v1/users/me`
        );

        if (response.status === 200) {
          const user = response.data;

          dispatch({
            type: "INITIAL",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIAL",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await axios.post(
      "http://localhost:3333/api/v1/auth/sign-in",
      {
        email,
        password,
      }
    );
    const { token, user } = response.data;
    const { access_token } = token;
    setSession(access_token);

    dispatch({
      type: "LOGIN",
      payload: {
        user,
        access_token,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    const response = await axios.post(
      "http://localhost:3333/api/v1/auth/sign-up",
      data
      // {
      //   withCredentials: true,
      // }
    );
    const { token, user } = response.data;
    const { access_token } = token;
    setSession(access_token);
    // sessionStorage.setItem("accessToken", accessToken);

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  }, []);

  const updatePicture = useCallback(async (data) => {
    const response = await axios.patch(
      "http://localhost:3333/api/v1/users/client/update-picture",
      data
    );
    const user = response.data;
    dispatch({
      type: "UPDATE_USER",
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      accessToken: state.accessToken,
      user: state.user,

      method: "jwt",
      initialize,
      login,
      register,
      updatePicture,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.accessToken,
      state.user,

      initialize,
      login,
      updatePicture,
      logout,
      register,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
