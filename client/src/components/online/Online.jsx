import "./online.css";

export default function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImageContainer">
        <img
          className="rightbarProfileImage"
          src={
            user.profilePicture
              ? user.profilePicture.startsWith("http")
                ? user.profilePicture
                : PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
