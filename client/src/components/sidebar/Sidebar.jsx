import "./sidebar.css";
import { useEffect, useState } from "react";
import ConfirmModal from "../confirmModal/ConfirmModal";
import axios from "axios";
import {
  RssFeed,
  Chat,
  PlayCircle,
  Group,
  Home,
  Logout,
  WorkOutline,
  Event,
  School,
  SmartToy,
} from "@mui/icons-material";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [friends, setFriends] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useContext(AuthContext); // Get logged-in user from context
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/friends/${user._id}`
        );
        setFriends(res.data);
      } catch (err) {
        console.log("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [user._id]);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setTimeout(() => {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      navigate("/login");
    }, 100);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to="/" className="sidebarLink">
            <li className="sidebarListItem">
              <Home className="sidebarIcon" />
              <span className="sidebarListItemText">Homepage</span>
            </li>
          </Link>
          <Link to={`/profile/${user.username}`} className="sidebarLink">
            <li className="sidebarListItem">
              <Group className="sidebarIcon" />
              <span className="sidebarListItemText">Friends</span>
            </li>
          </Link>
          <Link to="/messenger" className="sidebarLink">
            <li className="sidebarListItem">
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>
          <Link to="/ChatBot" className="sidebarLink">
            <li className="sidebarListItem">
              <SmartToy className="sidebarIcon" />
              <span className="sidebarListItemText">ChatBot</span>
            </li>
          </Link>
          {showConfirm && (
            <ConfirmModal
              message="Are you sure you want to logout?"
              onConfirm={confirmLogout}
              onCancel={() => setShowConfirm(false)}
            />
          )}
          <li
            className="sidebarListItem"
            onClick={() => {
              handleLogout();
            }}
            style={{ cursor: "pointer" }}
          >
            <Logout className="sidebarIcon" />
            <span className="sidebarListItemText">Logout</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircle className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>

          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {friends.map((friend) => (
            <CloseFriend key={friend._id} user={friend} />
          ))}
        </ul>
      </div>
    </div>
  );
}
