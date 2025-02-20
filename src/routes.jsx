import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirestore
} from "react-redux-firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  UserIsAllowedUserDashboard,
  UserIsAllowOrgManager,
  UserIsNotAllowedUserDashboard
} from "./auth";
import { AllowManageUser } from "./auth/manageUserAuth";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import NotFound from "./components/ErrorPages/404";
import HomePage from "./components/HomePage/index";
import ManageUsers from "./components/ManageUsers";
import MyFeed from "./components/MyFeed";
import Organization from "./components/Organization";
import ViewOrganization from "./components/Organization/ViewOrganization";
import Profile from "./components/Profile";
import ProfileView from "./components/Profile/ViewProfile";
import ViewTutorial from "./components/Tutorials";
import MyTutorials from "./components/Tutorials/MyTutorials";
import Spinner from "./helpers/spinner";
import CodeLabzAppBar from "./helpers/appBar";
import MainNavbar from "./components/NavBar/new/MainNavbar";
import UserDashboard from "./components/UserDashboard";
import TutorialPage from "./components/TutorialPage";
import Notification from "./components/Notification";
import SearchResultsComponent from "./components/Tutorials/MyTutorials/Search/SearchResultsComponent";
import { getProfileData } from "./store/actions";

const AuthIsLoaded = ({ children }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const profile = useSelector(({ firebase: { profile } }) => profile);
  const data = useSelector(({ profile: { data } }) => data);
  const general = useSelector(({ org: { general } }) => general);

  useEffect(() => {
    if (isLoaded(profile) && isLoaded(data) && isLoaded(general)) {
      return; // Avoid fetching if data is already loaded
    }
    getProfileData()(firebase, firestore, dispatch);
  }, [profile, firestore, firebase, dispatch]);

  //case for not logged in user
  if (
    isLoaded(profile) &&
    isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  //case for logged in uncompleted user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  //case for authed org user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    !isEmpty(data) &&
    isLoaded(general) &&
    !isEmpty(general)
  )
    return children;

  //case for authed normal user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  return <Spinner />;
};

// Remember to add the paths that the MINI navbar should
// be shown in components/NavBar/navbarPaths.js

const Routes = () => {
  return (
    <Router>
      <AuthIsLoaded>
        <CodeLabzAppBar />
        {/* <Navbar /> */}
        <Switch>
          <Route exact path={"/"} component={HomePage} />
          <Route
            exact
            path={"/login"}
            render={props => <AuthPage {...props} type={"login"} />}
          />
          <Route
            exact
            path={"/signup"}
            render={props => <AuthPage {...props} type={"signup"} />}
          />
          <Route
            exact
            path={"/forgotpassword"}
            render={props => <AuthPage {...props} type={"forgotpassword"} />}
          />
          <Route
            exact
            path={"/manageusers"}
            component={AllowManageUser(ManageUsers)}
          />
          <Route
            exact
            path={"/dashboard"}
            component={UserIsNotAllowedUserDashboard(Dashboard)}
          />
          <Route
            exact
            path={"/dashboard/my_feed"}
            component={UserIsAllowedUserDashboard(MyFeed)}
          />
          <Route
            exact
            path={"/profile"}
            component={UserIsAllowedUserDashboard(Profile)}
          />

          <Route
            exact
            path={"/org/settings/:handle"}
            component={UserIsAllowOrgManager(Organization)}
          />
          <Route
            exact
            path={"/tutorials"}
            component={UserIsAllowedUserDashboard(MyTutorials)}
          />
          <Route
            exact
            path={"/tutorials/:owner/:tutorial_id"}
            component={UserIsAllowedUserDashboard(ViewTutorial)}
          />
          <Route
            exact
            path={"/user/:handle"}
            component={UserIsAllowedUserDashboard(ProfileView)}
          />
          <Route
            exact
            path={"/org/:handle"}
            component={UserIsAllowedUserDashboard(ViewOrganization)}
          />
          <Route
            exact
            path={"/tutorial/:id"}
            component={UserIsAllowedUserDashboard(TutorialPage)}
          />
          <Route exact path={"/search"} component={SearchResultsComponent} />
          <Route
            exact
            path={"/editor"}
            component={UserIsAllowedUserDashboard(Editor)}
          />
          <Route
            path={"/user-dashboard/:page"}
            component={UserIsAllowedUserDashboard(UserDashboard)}
          />
          <Route
            exact
            path={"/notification"}
            component={UserIsAllowedUserDashboard(Notification)}
          />
          <Route exact path={"*"} component={NotFound} />
        </Switch>
        {/* <Footer /> */}
      </AuthIsLoaded>
    </Router>
  );
};

export default Routes;
