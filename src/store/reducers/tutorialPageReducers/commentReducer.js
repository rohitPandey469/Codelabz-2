import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  data: [],
  replies: []
};

const CommentReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GET_COMMENT_DATA_START:
      return {
        ...state,
        loading: true
      };

    case actions.GET_COMMENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data: [...state.data, payload]
      };

    case actions.GET_COMMENT_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case actions.GET_REPLIES_START:
      return {
        ...state,
        loading: true
      };

    case actions.GET_REPLIES_SUCCESS:
      return {
        ...state,
        loading: false,
        replies: [...state.replies, payload]
      };

    case actions.ADD_COMMENT_START:
      return {
        ...state,
        loading: true
      };

    case actions.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case actions.ADD_COMMENT_FAILED:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case actions.ADD_REPLY_SUCCESS:
      const index = state.replies.findIndex(
        reply => reply.comment_id === payload.comment_id
      );

      if (index !== -1) {
        const updatedReplies = [...state.replies];
        updatedReplies[index] = {
          ...updatedReplies[index],
          replies: [...updatedReplies[index].replies, ...payload.replies]
        };
        return {
          ...state,
          loading: false,
          replies: updatedReplies
        };
      }

      return {
        ...state,
        loading: false,
        replies: [
          ...state.replies,
          { comment_id: payload.comment_id, replies: payload.replies }
        ]
      };

    default:
      return state;
  }
};

export default CommentReducer;
