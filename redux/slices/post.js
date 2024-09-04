import { createSlice } from "@reduxjs/toolkit";
// utils
import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  posts: [],
  profilePosts: [],
  post: null,
};

const slice = createSlice({
  name: "Post",
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

    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },
    getPostsByIdSuccess(state, action) {
      state.isLoading = false;
      state.profilePosts = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
    },
    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload.post;
      state.post = action.payload;
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.profilePosts = state.profilePosts.filter(
        (post) => post.id !== action.payload
      );
    },
    getSinglePostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {} = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function createPost(newCourse) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        "http://localhost:3333/api/v1/posts",
        newCourse
      );
      dispatch(slice.actions.createPostSuccess(response.data));
      return response.status;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updatePost(data, postId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(
        `http://localhost:3333/api/v1/posts/${postId}`,
        data
      );
      dispatch(slice.actions.updatePostSuccess(response.data));
      return response.status;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// delete post
export function deletePost(postId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(
        `http://localhost:3333/api/v1/posts/${postId}`
      );
      dispatch(slice.actions.deletePostSuccess(postId));
      return response.status;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// get courses
export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get("http://localhost:3333/api/v1/posts");
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getPostsById(userId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `http://localhost:3333/api/v1/posts/${userId}/user-posts`
      );
      dispatch(slice.actions.getPostsByIdSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getSinglePost(postId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `http://localhost:3333/api/v1/posts/${postId}`
      );
      dispatch(slice.actions.getSinglePostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function addLikePost(postID, setLiked, setLikes, userId) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        `http://localhost:3333/api/v1/posts/${postID}/like`
      );
      const post = response.data.post;
      const hasLiked = post.likes.includes(userId);
      setLikes(response.data.likes);
      setLiked(hasLiked);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
