import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
} from "@mui/icons-material";

import { useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleSearch = async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/users/search?query=${query}`
      );
      setSearchResults(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">IntelliConnect</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar" ref={searchRef}>
          <Search
            className="searchIcon"
            onClick={() => {
              if (searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
            style={{ cursor: "pointer" }}
          />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
          />
          {showDropdown && (
  <ul className="searchDropdown">
    {searchResults.length > 0 ? (
      searchResults.map((user) => (
        <li
          key={user._id}
          onClick={() => {
            navigate(`/profile/${user.username}`);
            setSearchQuery("");
            setSearchResults([]);
            setShowDropdown(false);
          }}
          className="searchResultItem"
        >
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <span>{user.username}</span>
        </li>
      ))
    ) : (
      <li className="searchResultItem noResult">User not found</li>
    )}
  </ul>
)}

        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">
            <Link to="/ChatBot" className="chatbot-link">
              ChatBot
            </Link>
          </span>
          <span
            className="topbarLink"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link
              to="/messenger"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Chat />
            </Link>
            <span className="topbarIconBadge">2</span>
          </div>

          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
