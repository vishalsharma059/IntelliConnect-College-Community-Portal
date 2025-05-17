import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const PF =
    process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:8800/images/";
  const defaultProfilePic = PF + "person/noAvatar.png"; // Default image path

  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImage"
        src={
          user.profilePicture
            ? user.profilePicture.startsWith("http")
              ? user.profilePicture
              : PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt={user.username}
        onError={(e) => {
          e.target.src = defaultProfilePic;
        }} // Fallback if the image fails to load
      />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
