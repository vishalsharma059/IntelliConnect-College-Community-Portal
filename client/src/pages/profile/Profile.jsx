import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const username = useParams().username;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        setUser(null);
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [username]);

  // If user is null (not loaded or logged out), redirect or show fallback
  if (!user) {
    return (
      <>
        <Topbar />
        <div className="profile">
          <Sidebar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img className="profileCoverImage" src={PF + "person/noCover.png"} alt="" />
                <img className="profileUserImage" src={PF + "person/noAvatar.png"} alt="" />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName"></h4>
                <span className="profileInfoDesc"></span>
              </div>
            </div>
            <div className="profileRightBottom">
              {/* Optionally, show a message or redirect */}
              <span>User not found or logged out.</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImage"
                src={
                  user.coverPicture
                    ? user.coverPicture.startsWith("http")
                      ? user.coverPicture
                      : PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImage"
                src={
                  user.profilePicture
                    ? user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
          <div className="editProfileLink">
            <Link to={`/editProfile/${username}`} className="editProfileButton">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


