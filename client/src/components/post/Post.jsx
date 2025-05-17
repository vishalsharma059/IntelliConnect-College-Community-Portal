import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post, refreshProfile }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newDesc, setNewDesc] = useState(post.desc);
  const [originalDesc, setOriginalDesc] = useState(post.desc);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  // Toggle between view and edit mode
  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this post?"
    );
    if (confirmUpdate) {
      try {
        const updatedPost = { ...post, desc: newDesc }; // Prepare updated post
        await axios.put(
          `http://localhost:8800/api/posts/${post._id}`,
          updatedPost,
          { data: { userId: currentUser._id } }
        );
        setSuccessMessage("Post updated successfully");
        setIsEditing(false);
        setOriginalDesc(newDesc);
        refreshProfile();
      } catch (err) {
        console.error("Error updating post:", err);
        setSuccessMessage("Failed to update post");
      }
    }
  };

  const handleBlur = () => {
    // Revert to normal mode if no changes are made
    if (newDesc === originalDesc) {
      setIsEditing(false); // Exit edit mode without saving
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?userId=${post.userId}`
        );
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("http://localhost:8800/api/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/api/posts/${post._id}`, {
          data: { userId: currentUser._id },
        });
        setSuccessMessage("Post deleted successfully");
        refreshProfile(); // Refresh profile after delete
      } catch (err) {
        console.error("Error deleting post:", err);
        setSuccessMessage("Failed to delete post");
      }
    }
  };

  const updateHandler = async () => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this post?"
    );
    if (confirmUpdate) {
      try {
        const updatedPost = { ...post, desc: newDesc }; // Example updated post data
        await axios.put(
          `http://localhost:8800/api/posts/${post._id}`,
          updatedPost,
          { data: { userId: currentUser._id } }
        );
        setSuccessMessage("Post updated successfully");
        refreshProfile(); // Refresh profile after update
      } catch (err) {
        console.error("Error updating post:", err);
        setSuccessMessage("Failed to update post");
      }
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImage"
                src={
                  user.profilePicture
                    ? user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUserName">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId === currentUser._id && (
              <div>
                <button className="updateButton" onClick={handleUpdateClick}>
                  Update
                </button>
                <button className="deleteButton" onClick={deleteHandler}>
                  Delete
                </button>
              </div>
            )}
            <MoreVert />
          </div>
        </div>

        <div className="postCenter">
          {isEditing ? (
            <textarea
              className="postTextInput"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <span className="postText" onClick={handleTextClick}>
              {post?.desc}
            </span>
          )}
          {/* {post.img && <img className="postImage" src={PF + post.img} alt="" />} */}
          {post.img && (
            <img
              className="postImage"
              src={post.img.startsWith("http") ? post.img : PF + post.img}
              alt=""
            />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>

        {/* Success Message Display */}
        {successMessage && (
          <div className="successMessage">{successMessage}</div>
        )}
      </div>
    </div>
  );
}
