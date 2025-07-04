// import { useEffect, useState } from "react";
// import "./chatOnline.css";
// import axios from "axios";

// export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
//   const [friends, setFriends] = useState([]);
//   const [onlinefriends, setOnlineFriends] = useState([]);
//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;

//   useEffect(() => {
//     if (!currentId) {
//       console.error("currentId is undefined or null");
//       return;
//     }

//     const getFriends = async () => {
//       try {
//         const res = await axios.get("/users/friends/" + currentId);
//         setFriends(res.data);
//       } catch (err) {
//         console.error("Error fetching friends:", err.message);
//       }
//     };

//     getFriends();
//   }, [currentId]);

//   useEffect(() => {
//     setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
//   }, [friends, onlineUsers]);

//   const handleClick = async (user) => {
//     try {
//       let res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
      
//       if (!res.data) {
//         // If no conversation exists, create a new one
//         res = await axios.post("/conversations", {
//           senderId: currentId,
//           receiverId: user._id,
//         });
//       }
  
//       setCurrentChat(res.data); // Set the conversation to the current chat
//     } catch (err) {
//       console.error("Error fetching or creating conversation:", err);
//     }
//   };
  

//   return (
//     <div className="chatOnline">
//       {onlinefriends.map((o) => (
//         <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o._id}>
//           <div className="chatOnlineImageContainer">
//             <img
//   className="chatOnlineImage"
//   src={
//     o?.profilePicture
//       ? o.profilePicture.startsWith("http")
//         ? o.profilePicture
//         : PF + o.profilePicture
//       : PF + "person/noAvatar.png"
//   }
//   alt=""
// />
//             <div className="chatOnlineBadge"></div>
//           </div>
//           <span className="chatOnlineName">{o.username}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800/api";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlinefriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (!currentId) {
      console.error("currentId is undefined or null");
      return;
    }

    const getFriends = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/friends/${currentId}`);
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err.message);
      }
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    console.log("friends:", friends);
    console.log("onlineUsers:", onlineUsers);

    if (Array.isArray(friends) && Array.isArray(onlineUsers)) {
      setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    } else {
      setOnlineFriends([]);
    }
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      let res = await axios.get(`${API_URL}/api/conversations/find/${currentId}/${user._id}`);

      if (!res.data) {
        // If no conversation exists, create a new one
        res = await axios.post(`${API_URL}/api/conversations`, {
          senderId: currentId,
          receiverId: user._id,
        });
      }

      setCurrentChat(res.data); // Set the conversation to the current chat
    } catch (err) {
      console.error("Error fetching or creating conversation:", err);
    }
  };

  return (
    <div className="chatOnline">
      {onlinefriends.map((o) => (
        <div
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
          key={o._id}
        >
          <div className="chatOnlineImageContainer">
            <img
              className="chatOnlineImage"
              src={
                o?.profilePicture
                  ? o.profilePicture.startsWith("http")
                    ? o.profilePicture
                    : PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  );
}

