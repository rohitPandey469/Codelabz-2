import * as actions from "./actionTypes";

export const checkExistingFeedback =
  (userId, itemId, itemType) => async (firebase, firestore) => {
    try {
      const likeRef = firestore
        .collection(itemType) // will work for both comment_likes and tutorial_likes
        .doc(`${userId}_${itemId}`);

      const snapshot = await likeRef.get();

      if (!snapshot.empty) {
        // like or dislike info will be provided here
        return snapshot?.data()?.value;
      } else {
        return 0; // No feedback given
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getVotesData =
  (itemId, itemType) => async (firebase, firestore, dispatch) => {
    try {
      if (itemType === "comment") itemType = "cl_comment";

      const itemDoc = await firestore
        .collection(`${itemType}s`)
        .doc(itemId)
        .get();

      const { upvotes, downvotes } = itemDoc.data();
      dispatch({
        type: actions.GET_VOTES_DATA_SUCCESS,
        payload: { itemId, itemType, upvotes, downvotes }
      });
    } catch (error) {
      dispatch({ type: actions.GET_VOTES_DATA_FAIL, payload: error.message });
    }
  };

export const updateUpvote =
  (userId, itemId, itemType) => async (firebase, firestore, dispatch) => {
    try {
      const dataToSet = {
        uid: userId,
        value: 1
      };
      if (itemType == "tutorial") dataToSet["tut_id"] = itemId;
      else if (itemType == "comment") dataToSet["comment_id"] = itemId;

      await firestore
        .collection(`${itemType}_likes`)
        .doc(`${userId}_${itemId}`)
        .set(dataToSet);

      if (itemType == "comment") itemType = "cl_comment";

      await firestore
        .collection(`${itemType}s`) // tutorials and cl_comments
        .doc(itemId)
        .update({
          upvotes: firebase.firestore.FieldValue.increment(1)
        });

      const itemDoc = await firestore
        .collection(`${itemType}s`)
        .doc(itemId)
        .get();

      const { upvotes, downvotes } = itemDoc.data();

      dispatch({
        type: actions.UPDATE_UPVOTE_SUCCESS,
        payload: { itemId, itemType, upvotes, downvotes }
      });
    } catch (error) {
      dispatch({ type: actions.UPDATE_UPVOTE_FAIL, payload: error.message });
    }
  };

export const updateDownvote =
  (userId, itemId, itemType) => async (firebase, firestore, dispatch) => {
    try {
      const dataToSet = {
        uid: userId,
        value: -1
      };
      if (itemType == "tutorial") dataToSet["tut_id"] = itemId;
      else if (itemType == "comment") dataToSet["comment_id"] = itemId;

      await firestore
        .collection(`${itemType}_likes`)
        .doc(`${userId}_${itemId}`)
        .set(dataToSet);

      if (itemType == "comment") itemType = "cl_comment";

      await firestore
        .collection(`${itemType}s`)
        .doc(itemId)
        .update({
          downvotes: firebase.firestore.FieldValue.increment(1)
        });

      const itemDoc = await firestore
        .collection(`${itemType}s`)
        .doc(itemId)
        .get();

      const { upvotes, downvotes } = itemDoc.data();

      dispatch({
        type: actions.UPDATE_DOWNVOTE_SUCCESS,
        payload: { itemId, itemType, upvotes, downvotes }
      });
    } catch (error) {
      dispatch({ type: actions.UPDATE_DOWNVOTE_FAIL, payload: error.message });
    }
  };

export const undoVote =
  (userId, itemId, itemType, value) =>
  async (firebase, firestore, dispatch) => {
    try {
      await firestore
        .collection(`${itemType}_likes`)
        .doc(`${userId}_${itemId}`)
        .delete();

      if (itemType == "comment") itemType = "cl_comment";

      if (value == 1) {
        //undo the upvote
        await firestore
          .collection(`${itemType}s`)
          .doc(itemId)
          .update({
            upvotes: firebase.firestore.FieldValue.increment(-1)
          });
      } else if (value == -1) {
        // undo the downvote
        await firestore
          .collection(`${itemType}s`)
          .doc(itemId)
          .update({
            downvotes: firebase.firestore.FieldValue.increment(-1)
          });
      }

      const itemDoc = await firestore
        .collection(`${itemType}s`)
        .doc(itemId)
        .get();

      const { upvotes, downvotes } = itemDoc.data();

      dispatch({
        type: actions.UNDO_VOTE_SUCCESS,
        payload: { itemId, itemType, upvotes, downvotes }
      });
    } catch (error) {
      dispatch({ type: actions.UNDO_VOTE_FAIL, payload: error.message });
    }
  };
