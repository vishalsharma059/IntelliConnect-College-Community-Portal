import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import Online from "../online/Online";

export default function Rightbar({ user, onlineUsers = [] }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(currentUser.following.includes(user?._id));
  }, [currentUser, user]);

  useEffect(() => {
    const activeUserId = user?._id || currentUser._id;
    if (!activeUserId) return;
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/friends/` + activeUserId
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/` +
            user._id +
            "/unfollow",
          { userId: currentUser._id }
        );
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/` + user._id + "/follow",
          { userId: currentUser._id }
        );
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img src="assets/gift.png" alt="" className="birthdayImage" />
        <span className="birthdayText">
          <b>Nabh Gupta</b> and <b>3 other friends</b> have a birthday today.
        </span>
      </div>
      <img className="rightbarAd" src="assets/NewPoster.jpg" alt="" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {friends
          .filter((friend) => onlineUsers.some((u) => u.userId === friend._id))
          .map((onlineFriend) => (
            <Online key={onlineFriend._id} user={onlineFriend} />
          ))}
      </ul>
    </>
  );

  const ProfileRightbar = () => (
    <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add />}
        </button>
      )}
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">College:</span>
        <span className="rightbarInfoValue">{user.college || "-"}</span>
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">Role:</span>
        <span className="rightbarInfoValue">{user.role || "-"}</span>
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">Course:</span>
        <span className="rightbarInfoValue">{user.course || "-"}</span>
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">City:</span>
        <span className="rightbarInfoValue">{user.city || "-"}</span>
      </div>
      <h4 className="rightbarTitle">User Friends</h4>
      <div className="rightbarFollowings">
        {friends.map((friend) => (
          <Link
            to={`/profile/${friend.username}`}
            style={{ textDecoration: "none" }}
            key={friend._id}
          >
            <div className="rightbarFollowing">
              <img
                src={
                  friend.profilePicture
                    ? friend.profilePicture.startsWith("http")
                      ? friend.profilePicture
                      : PF + friend.profilePicture
                    : PF + "person/noAvatar.png"
                }
                className="rightbarFollowingImage"
                alt=""
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className={`rightbar ${user ? "" : "homeRightbar"}`}>
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
