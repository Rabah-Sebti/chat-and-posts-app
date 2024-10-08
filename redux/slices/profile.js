import { createSlice } from "@reduxjs/toolkit";
// utils
import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  image: null,
};

const slice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetError(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    editProfileSuccess(state, action) {
      state.isLoading = false;
    },
    editPasswordSuccess(state, action) {
      state.isLoading = false;
    },
    uploadImageSuccess(state, action) {
      state.isLoading = false;
      state.image = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { resetError } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function editProfile(userInput) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch("/api/v1/users/edit", {
        ...userInput,
      });

      dispatch(slice.actions.editProfileSuccess(response.data));
      return response.status;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function editPassword(userInput) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(
        "/api/v1/users/client/update-password",
        {
          ...userInput,
        }
      );

      dispatch(slice.actions.editPasswordSuccess());
      return response.status;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
