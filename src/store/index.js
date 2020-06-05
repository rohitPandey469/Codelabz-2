import { createStore, applyMiddleware, compose } from "redux";
import { getFirebase } from "react-redux-firebase";
import { createFirestoreInstance, getFirestore } from "redux-firestore";

import thunk from "redux-thunk";

import rootReducer from "./reducers";

import firebase from "../config";

// react-redux-firebase config
const rrfConfig = {
  userProfile: "cl_user", // Profile data stored in Firestore/cl_user/user_id
  presence: "cl_user_presence",
  sessions: "cl_user_sessions",
  profileFactory: ({ user }) => ({
    email: user.email,
    uid: user.uid
  }),
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime
  attachAuthIsReady: true
};

// Create store with reducers and initial state
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
  )
);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
};

export default store;