import {
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardActions from "@mui/material/CardActions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "react";
import Textbox from "./Textbox";
import User from "../UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import {
  getCommentData,
  getCommentReply,
  addComment
} from "../../../../store/actions/tutorialPageActions";
import handleLike from "../../../../services/likeService";
import handleDislike from "../../../../services/dislikeService";
import { checkExistingFeedback, getVotesData } from "../../../../store/actions";
const useStyles = makeStyles(() => ({
  container: {
    margin: "10px 0",
    padding: "20px",
    overflow: "unset"
  },
  bold: {
    fontWeight: "600"
  },
  comments: {
    margin: "5px",
    padding: "10px 15px"
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px"
  },
  small: {
    padding: "2px"
  }
}));

const Comment = ({ id }) => {
  const classes = useStyles();
  const [showReplyfield, setShowReplyfield] = useState(false);
  const [alignment, setAlignment] = React.useState("left");
  const [feedback, setFeedback] = useState(0);
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.firebase.auth.uid);
  useState(() => {
    getCommentData(id)(firebase, firestore, dispatch);
  }, [id]);

  const commentsArray = useSelector(
    ({
      tutorialPage: {
        comment: { data }
      }
    }) => data
  );

  const [data] = commentsArray.filter(comment => comment.comment_id == id);
  console.log("Data from Comment.jsx", data);

  const repliesArray = useSelector(
    ({
      tutorialPage: {
        comment: { replies }
      }
    }) => replies
  );

  const [replies] = repliesArray.filter(replies => replies.comment_id == id);

  const handleIncrement = async () => {
    await handleLike(
      firebase,
      firestore,
      dispatch,
      data?.comment_id,
      "comment"
    );
  };

  const handleDecrement = async () => {
    await handleDislike(
      firebase,
      firestore,
      dispatch,
      data?.comment_id,
      "comment"
    );
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    getVotesData(data?.comment_id, "comment")(firebase, firestore, dispatch);
  }, [firebase, firestore, dispatch, data]);

  const votes = useSelector(
    state => state.tutorials.vote.votes[data?.comment_id] || {}
  );

  const handleSubmit = comment => {
    const commentData = {
      content: comment,
      replyTo: data.comment_id,
      tutorial_id: data.tutorial_id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: "codelabzuser",
      upvotes: 0,
      downvotes: 0
    };
    addComment(commentData)(firebase, firestore, dispatch);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      const get_feedback = await checkExistingFeedback(
        userId,
        data?.comment_id,
        "comment_likes"
      )(firebase, firestore, dispatch);
      if (get_feedback != undefined) {
        setFeedback(get_feedback);
      }
    };
    fetchFeedback();
  }, [firebase, firestore, dispatch, data, votes]);

  return (
    data && (
      <>
        <Paper variant="outlined" className={classes.comments}>
          <Typography mb={1} sx={{ fontSize: "18px" }}>
            {data?.content}
          </Typography>
          <Grid container justifyContent="space-between">
            <User id={data?.userId} timestamp={data?.createdAt} size={"sm"} />
            <CardActions className={classes.settings} disableSpacing>
              {!showReplyfield && (
                <Button
                  onClick={() => {
                    setShowReplyfield(true);
                    getCommentReply(id)(firebase, firestore, dispatch);
                  }}
                  sx={{ textTransform: "none", fontSize: "12px" }}
                >
                  {replies?.replies?.length > 0 && replies?.replies?.length}{" "}
                  Reply
                </Button>
              )}
              <ToggleButtonGroup
                size="small"
                className={classes.small}
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton
                  className={classes.small}
                  onClick={handleIncrement}
                  value="left"
                  aria-label="left aligned"
                  selected={feedback === 1 ? true : false}
                >
                  <KeyboardArrowUpIcon />
                  <span>{votes?.upvotes}</span>
                </ToggleButton>
                <ToggleButton
                  className={classes.small}
                  onClick={handleDecrement}
                  value="center"
                  aria-label="centered"
                  selected={feedback === -1 ? true : false}
                >
                  <KeyboardArrowDownIcon />
                  <span>{votes?.downvotes == 0 ? "" : votes.downvotes}</span>
                </ToggleButton>
              </ToggleButtonGroup>
              <IconButton aria-label="share" data-testId="MoreIcon">
                <MoreVertOutlinedIcon />
              </IconButton>
            </CardActions>
          </Grid>
        </Paper>
        {showReplyfield && (
          <div style={{ margin: "10px 0 0 10px" }}>
            <Textbox type="reply" handleSubmit={handleSubmit} />
            {replies?.replies.map((id, index) => {
              return <Comment id={id} />;
            })}
          </div>
        )}
      </>
    )
  );
};

export default Comment;
