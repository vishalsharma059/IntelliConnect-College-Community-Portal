import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ConfirmModal from "../confirmModal/ConfirmModal";

export default function Post({ post, refreshProfile }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newDesc, setNewDesc] = useState(post.desc);
  const [originalDesc, setOriginalDesc] = useState(post.desc);
  const [confirmAction, setConfirmAction] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  const handleBlur = () => {
    if (newDesc === originalDesc) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users?userId=${post.userId}`
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
      axios.put(
        `${process.env.REACT_APP_API_URL}/api/posts/` + post._id + "/like",
        {
          userId: currentUser._id,
        }
      );
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    setConfirmAction("update");
  };

  const handleDeleteClick = () => {
    setConfirmAction("delete");
  };

  const handleConfirm = async () => {
    if (confirmAction === "update") {
      try {
        const updatedPost = { ...post, desc: newDesc }; // Prepare updated post
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/posts/${post._id}`,
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
    } else if (confirmAction === "delete") {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/posts/${post._id}`,
          {
            data: { userId: currentUser._id },
          }
        );
        setSuccessMessage("Post deleted successfully");
        refreshProfile(); // Refresh profile after delete
      } catch (err) {
        console.error("Error deleting post:", err);
        setSuccessMessage("Failed to delete post");
      }
    }
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmAction(null);
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
                <button className="deleteButton" onClick={handleDeleteClick}>
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

        {successMessage && (
          <div className="successMessage">{successMessage}</div>
        )}
      </div>
      {confirmAction && (
        <ConfirmModal
          message={
            confirmAction === "update"
              ? "Are you sure you want to update this post?"
              : "Are you sure you want to delete this post?"
          }
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
