import {
  checkExistingFeedback,
  undoVote,
  updateDownvote
} from "../store/actions";

const handleDislike = async (firebase, firestore, dispatch, tutorialId) => {
  try {
    const currentUser = firebase.auth().currentUser;
    const userId = currentUser.uid;
    if (!currentUser) {
      return;
    }
    const existingFeedback = await checkExistingFeedback(userId, tutorialId)(
      firebase,
      firestore,
      dispatch
    );
    if (existingFeedback === -1) {
      // User already disliked - undo dislike
      console.log("Undo Downvote");
      await undoVote(userId, tutorialId, existingFeedback)(
        firebase,
        firestore,
        dispatch
      ); // removed the dislike
    } else if (existingFeedback === 1) {
      // User liked - change like to dislike
      console.log("Change Like to Dislike");
      await undoVote(userId, tutorialId, existingFeedback)(
        firebase,
        firestore,
        dispatch
      ); // removed the like
      await updateDownvote(userId, tutorialId)(firebase, firestore, dispatch); // disliked
    } else {
      // No previous record - add a new dislike
      console.log("Add a new Dislike");
      await updateDownvote(userId, tutorialId)(firebase, firestore, dispatch);
    }
  } catch (error) {
    console.log("Error handling Dislike:", error);
  }
};

export default handleDislike;
