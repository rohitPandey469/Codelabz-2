import {
  checkExistingFeedback,
  undoVote,
  updateUpvote
} from "../store/actions";

const handleLike = async (firebase, firestore, dispatch, itemId, itemType) => {
  try {
    const currentUser = firebase.auth().currentUser;
    const userId = currentUser.uid;
    if (!currentUser) {
      return;
    }
    const existingFeedback = await checkExistingFeedback(
      userId,
      itemId,
      `${itemType}_likes`
    )(firebase, firestore);
    if (existingFeedback === 1) {
      // User already liked - undo like
      console.log("Undo upVote");
      await undoVote(
        userId,
        itemId,
        itemType,
        existingFeedback
      )(firebase, firestore, dispatch); // removed the like
    } else if (existingFeedback === -1) {
      // User disliked - change dislike to like
      console.log("Change  Dislike To Like");
      await undoVote(
        userId,
        itemId,
        itemType,
        existingFeedback
      )(firebase, firestore, dispatch); // removed the dislike
      await updateUpvote(userId, itemId, itemType)(
        firebase,
        firestore,
        dispatch
      ); // liked
    } else {
      // No previous record - add a new like
      console.log("Just add a normal like");
      await updateUpvote(userId, itemId, itemType)(
        firebase,
        firestore,
        dispatch
      );
    }
  } catch (error) {
    console.log("Error handling Like:", error);
  }
};

export default handleLike;
