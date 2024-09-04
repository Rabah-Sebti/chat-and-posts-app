import { createSlice } from "@reduxjs/toolkit";
// utils
import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  messages: [],
  socket: null,
  totalMessages: null,
  UnreadMessages: 0,
  users: [],
};

const slice = createSlice({
  name: "Chat",
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

    getMessagesSuccess(state, action) {
      state.isLoading = false;
      state.messages = action.payload.messages;
      state.totalMessages = action.payload.totalMessages;
    },
    getPostsByIdSuccess(state, action) {
      state.isLoading = false;
      state.profilePosts = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
    },
    addMessageSuccess(state, action) {
      state.isLoading = false;
    },
    createSocket(state, action) {
      console.log(action.payload);
    },
    getUnreadMessagesSuccess(state, action) {
      state.isLoading = false;
      state.UnreadMessages = action.payload.unread_messages;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { createSocket } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function addMessage(data, setNewMessages, newMessages, socket) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        `http://localhost:3333/api/v1/messages/add-message`,
        data
      );
      const updatedMessages = [...newMessages, response.data];
      setNewMessages(updatedMessages);
      dispatch(slice.actions.addMessageSuccess(response.data.msg));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// get messages
export function getMessages(setNewMessages, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        `http://localhost:3333/api/v1/messages`,
        data
      );
      setNewMessages((prev) => [...response.data.messages, ...prev]);
      dispatch(slice.actions.getMessagesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        "http://localhost:3333/api/v1/users",
        {}
      );
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateUnreadMessages(data, setUnreadMessages) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(
        `http://localhost:3333/api/v1/messages/update-messages`,
        data
      );
      setUnreadMessages((prev) => prev - response.data.count);
      dispatch(slice.actions.addMessageSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getAllUnreadMessages(setUnreadMessages) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `http://localhost:3333/api/v1/messages/unread-messages`
      );

      setUnreadMessages(response.data.unread_messages);
      dispatch(slice.actions.getUnreadMessagesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
