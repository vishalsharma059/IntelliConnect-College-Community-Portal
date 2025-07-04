import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (!conversation || !conversation.members) {
      console.error("Invalid conversation object:", conversation);
      return;
    }

    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users?userId=${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      {!user ? (
        <span>Loading...</span>
      ) : (
        <>
          <img
            className="conversationImage"
            src={
              user.profilePicture
                ? user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="Profile"
          />
          <span className="conversationName">
            {user?.username || "Unknown User"}
          </span>
        </>
      )}
    </div>
  );
}
