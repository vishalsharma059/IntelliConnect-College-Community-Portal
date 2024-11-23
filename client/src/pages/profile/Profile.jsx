import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({})
  const username = useParams().username;
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [username]);


  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img className="profileCoverImage" src={ user.coverPicture ? PF + user.coverPicture : PF+"person/noCover.png"}  alt="" />
              <img className="profileUserImage" src= { user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={ username } />
            <Rightbar user={user} />
          </div>
          {/* Add Edit Profile Link */}
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
