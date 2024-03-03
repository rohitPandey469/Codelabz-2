import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  votes: {}
};

const votesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GET_VOTES_DATA_SUCCESS:
      return {
        ...state,
        votes: {
          ...state.votes,
          [payload.itemId]: {
            upvotes: payload.upvotes,
            downvotes: payload.downvotes
          }
        }
      };

    case actions.UPDATE_UPVOTE_SUCCESS:
    case actions.UPDATE_DOWNVOTE_SUCCESS:
    case actions.UNDO_VOTE_SUCCESS:
      return {
        ...state,
        votes: {
          ...state.votes,
          [payload.itemId]: {
            upvotes: payload.upvotes,
            downvotes: payload.downvotes
          }
        }
      };

    case actions.UPDATE_UPVOTE_FAIL:
    case actions.UPDATE_DOWNVOTE_FAIL:
    case actions.UNDO_VOTE_FAIL:
    case actions.GET_VOTES_DATA_FAIL:
      return {
        ...state,
        error: payload
      };

    default:
      return state;
  }
};

export default votesReducer;
