import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./css/ProjectTitle.css";
import TimeAgo from "react-timeago";
import "./css/CommentSection.css";

const ProjectTitle = () => {
  const { id, ticket } = useParams();
  const [pending, setPending] = useState();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState("");
  const GET_COMMENTS = `/api/project/get-comments/${ticket}`;
  const POST_COMMENT = `/api/project/post-comment/${ticket}`;

  const getComments = async () => {
    try {
      const response = await axios.get(GET_COMMENTS, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log("my comment", response);
      setComments(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 2");
      }
    }
  };

  const postComment = async () => {
    axios
      .post(POST_COMMENT, JSON.stringify({ post }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {
        getComments();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (ticket) {
      getComments();
    }
  }, [ticket]);

  if (!pending && ticket) {
    return (
      <div className="comment-container">
        <h1 className="comment-title">Comments</h1>
        <div>
          <input
            className="comment-input"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            type="text"
            id="post"
            name="post"
            required
            placeholder="enter a comment.."
          />
          <button onClick={postComment} className="comment-button">
            Post
          </button>
        </div>
        {comments.map((comment) => {
          return (
            <div className="comment-wrapper" key={comment.id}>
              <div className="comment-heading">
                posted by {comment.name}{" "}
                <TimeAgo date={comment.posted} live={false} />
              </div>
              {comment.comment}
            </div>
          );
        })}
        <div></div>
      </div>
    );
  }
};

export default ProjectTitle;
