import { createSlice } from "@reduxjs/toolkit";
// utils
import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  comments: [],
  comment: null,
};

const slice = createSlice({
  name: "Comment",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCommentsSuccess(state, action) {
      state.isLoading = false;
    },

    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.comment = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {} = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function createComment(newComment, setComments) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post("/api/v1/comments", newComment);
      dispatch(slice.actions.createCommentSuccess(response.data));
      setComments((prev) => [...prev, response.data]);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getComments(data, setComments, setTotalComments) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/comments/post`, data);
      setComments((prev) => [...prev, ...response.data.comments]);
      setTotalComments(response.data.totalComments);
      dispatch(slice.actions.getCommentsSuccess(response.data.comments));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
