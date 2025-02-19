import React, { useEffect, useState } from "react";
import { Typography, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../../store/actions";
import { isUserFollower } from "../../../store/actions/profileActions";
import { addUserFollower } from "../../../store/actions";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    boxSizing: "border-box"
  },
  small: {
    padding: "2px"
  },
  bold: {
    fontWeight: "600"
  }
}));

const User = ({ id, timestamp, size }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [isFollowed, setIsFollowed] = useState(true);
  useEffect(() => {
      getUserProfileData(id)(firebase, firestore, dispatch);
  }, [id, firebase, firestore, dispatch]);

  const profileData = useSelector(({ firebase: { profile } }) => profile);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  console.log("profileData", user);
  useEffect(() => {
    const checkIsFollowed = async () => {
      const status = await isUserFollower(
        profileData?.uid,
        user?.uid,
        firestore
      );
      setIsFollowed(status);
    };
    if (id && user && profileData) {
      checkIsFollowed();
    }
    return () => {};
  }, [profileData, user]);

  const followUser = async () => {
    await addUserFollower(profileData, user, firestore);
  };

  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };

  const showFollowButton = profileData?.uid !== user?.uid;

  // const userProfileLink = `/profile/${user?.uid}`
  const userProfileLink = '/profile'

  return (
    <>
      <Grid
        item
        container
        justifyContent="start"
        alignItems="start"
        columnSpacing={1}
        xs={6}
      >
        <Grid sx={{ height: "100%", width: "auto"}} item>
          <Link to={userProfileLink}>
            <Avatar
              sx={{
                height: size == "sm" ? "24px" : "40px",
                width: size == "sm" ? "24px" : "40px"
              }}
            >
              {user?.photoURL && user?.photoURL.length > 0 ? (
                <img src={user?.photoURL} />
              ) : (
                user?.displayName?.charAt(0).toUpperCase()
              )}
            </Avatar>
          </Link>
        </Grid>
        <Grid item sx={{ width: "fit-content" }}>
          <Link to={userProfileLink}>
            <Typography
              sx={{
                fontSize: size == "sm" ? "14px" : "16px"
              }}
            >
              <span className={classes.bold} data-testId="tutorialpageAuthorName">
                {user?.displayName}
              </span>
            </Typography>
          </Link>
          <Typography
            sx={{
              fontSize: size == "sm" ? "10px" : "12px",
              opacity: "0.5",
              fontWeight: "600"
            }}
          >
            {timestamp ? getTime(timestamp) : ""}
          </Typography>
          {showFollowButton && (
            <Button
              variant="contained"
              onClick={followUser}
              disabled={isFollowed}
              sx={{
                borderRadius: "50px",
                height: "20px",
                textTransform: "none",
                padding: "1px 10px",
              }}
            >
              {isFollowed ? "Following" : "Follow +"}
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default User;
