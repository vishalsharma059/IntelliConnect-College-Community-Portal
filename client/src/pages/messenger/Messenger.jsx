// import "./messenger.css";
// import Topbar from "../../components/topbar/Topbar";
// import Conversation from "../../components/conversation/Conversation";
// import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
// import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { io } from "socket.io-client";

// export default function Messenger() {
//   const [conversations, setConversations] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [arrivalMessage, setArrivalMessage] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const socket = useRef();
//   const scrollRef = useRef(null);
//   const { user } = useContext(AuthContext);

//   // Establish the socket connection
//   useEffect(() => {
//     socket.current = io(process.env.REACT_APP_SOCKET_URL);

//     socket.current.on("getMessage", (data) => {
//       setArrivalMessage({
//         sender: data.senderId,
//         text: data.text,
//         createdAt: Date.now(),
//       });
//     });

//     // Disconnect socket on component unmount
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
//       setMessages((prev) => [...prev, arrivalMessage]);
//     }
//   }, [arrivalMessage, currentChat]);

//   // Handle socket events for online users
//   useEffect(() => {
//     const handleGetUsers = (users) => {
//       setOnlineUsers(user.following.filter((f) => users.some((u) => u.userId === f)));
//     };

//     if (user?._id) {
//       socket.current.emit("addUser", user._id);
//       socket.current.on("getUsers", handleGetUsers);
//     }

//     // Cleanup to avoid duplicate event listeners
//     return () => {
//       socket.current.off("getUsers", handleGetUsers);
//     };
//   }, [user]);

//   // Fetch conversations
//   useEffect(() => {
//     const getConversations = async () => {
//       try {
//         const res = await axios.get("/conversations/" + user._id);
//         setConversations(res.data);
//       } catch (err) {
//         console.error("Error fetching conversations:", err);
//       }
//     };
//     getConversations();
//   }, [user._id]);

//   // Fetch messages
//   useEffect(() => {
//     const getMessage = async () => {
//       try {
//         const res = await axios.get("/messages/" + currentChat?._id);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };
//     if (currentChat) getMessage();
//   }, [currentChat]);

//   // Handle message submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return; // Prevent empty submissions

//     const message = {
//       sender: user._id,
//       text: newMessage,
//       conversationId: currentChat._id,
//     };

//     setIsLoading(true); // Start loading

//     const receiverId = currentChat.members.find((member) => member !== user._id);

//     socket.current.emit("sendMessage", {
//       senderId: user._id,
//       receiverId,
//       text: newMessage,
//     });

//     try {
//       const res = await axios.post("/messages", message);
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage(""); // Clear textarea
//     } catch (err) {
//       console.error("Error sending message:", err);
//       alert("Failed to send message. Please try again.");
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   // Scroll to the bottom when a new message is added
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <>
//       <Topbar />
//       <div className="messenger">
//         <div className="chatMenu">
//           <div className="chatMenuWrapper">
//             <input placeholder="Search for friends" className="chatMenuInput" />
//             {conversations &&
//               conversations.map((c) => (
//                 <div onClick={() => setCurrentChat(c)} key={c._id}>
//                   <Conversation conversation={c} currentUser={user} />
//                 </div>
//               ))}
//           </div>
//         </div>
//         <div className="chatBox">
//           <div className="chatBoxWrapper">
//             {currentChat ? (
//               <>
//                 <div className="chatBoxTop">
//                   {messages.map((m, index) => (
//                     <div ref={scrollRef} key={index}>
//                       <Message message={m} own={m.sender === user._id} />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="chatBoxBottom">
//                   <textarea
//                     className="chatMessageInput"
//                     placeholder="write something..."
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     value={newMessage}
//                     disabled={isLoading} // Disable while loading
//                   ></textarea>
//                   <button
//                     className="chatSubmitButton"
//                     onClick={handleSubmit}
//                     disabled={isLoading} // Disable while loading
//                   >
//                     {isLoading ? "Sending..." : "Send"}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <span className="noConversationText">
//                 Open a conversation to start a chat.
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="chatOnline">
//           <div className="chatOnlineWrapper">
//             <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import "./messenger.css";
// import Topbar from "../../components/topbar/Topbar";
// import Conversation from "../../components/conversation/Conversation";
// import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
// import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { io } from "socket.io-client";

// export default function Messenger() {
//   const [conversations, setConversations] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [arrivalMessage, setArrivalMessage] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const socket = useRef();
//   const scrollRef = useRef(null);
//   const { user } = useContext(AuthContext);

//   // Establish the socket connection
//   useEffect(() => {
//     socket.current = io(process.env.REACT_APP_SOCKET_URL);

//     socket.current.on("getMessage", (data) => {
//       setArrivalMessage({
//         sender: data.senderId,
//         text: data.text,
//         createdAt: Date.now(),
//       });
//     });

//     // Disconnect socket on component unmount
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
//       setMessages((prev) => [...prev, arrivalMessage]);
//     }
//   }, [arrivalMessage, currentChat]);

//   // Handle socket events for online users
//   useEffect(() => {
//     const handleGetUsers = (users) => {
//       setOnlineUsers(user.following.filter((f) => users.some((u) => u.userId === f)));
//     };

//     if (user?._id) {
//       socket.current.emit("addUser", user._id);
//       socket.current.on("getUsers", handleGetUsers);
//     }

//     // Cleanup to avoid duplicate event listeners
//     return () => {
//       socket.current.off("getUsers", handleGetUsers);
//     };
//   }, [user]);

//   // Fetch conversations
//   useEffect(() => {
//     const getConversations = async () => {
//       try {
//         const res = await axios.get("/conversations/" + user._id);
//         setConversations(res.data);
//       } catch (err) {
//         console.error("Error fetching conversations:", err);
//       }
//     };
//     getConversations();
//   }, [user._id]);

//   // Fetch messages with safe data handling
//   useEffect(() => {
//     const getMessage = async () => {
//       try {
//         const res = await axios.get("/messages/" + currentChat?._id);
//         setMessages(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };
//     if (currentChat) getMessage();
//   }, [currentChat]);

//   // Handle message submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return; // Prevent empty submissions

//     const message = {
//       sender: user._id,
//       text: newMessage,
//       conversationId: currentChat._id,
//     };

//     setIsLoading(true); // Start loading

//     const receiverId = currentChat.members.find((member) => member !== user._id);

//     socket.current.emit("sendMessage", {
//       senderId: user._id,
//       receiverId,
//       text: newMessage,
//     });

//     try {
//       const res = await axios.post("/messages", message);
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage(""); // Clear textarea
//     } catch (err) {
//       console.error("Error sending message:", err);
//       alert("Failed to send message. Please try again.");
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   // Scroll to the bottom when a new message is added
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <>
//       <Topbar />
//       <div className="messenger">
//         <div className="chatMenu">
//           <div className="chatMenuWrapper">
//             <input placeholder="Search for friends" className="chatMenuInput" />
//             {conversations &&
//               conversations.map((c) => (
//                 <div onClick={() => setCurrentChat(c)} key={c._id}>
//                   <Conversation conversation={c} currentUser={user} />
//                 </div>
//               ))}
//           </div>
//         </div>
//         <div className="chatBox">
//           <div className="chatBoxWrapper">
//             {currentChat ? (
//               <>
// <div className="chatBoxTop">
//   {(Array.isArray(messages) ? messages : []).map((m, index) => (
//     <div ref={scrollRef} key={index}>
//       <Message message={m} own={m.sender === user._id} />
//     </div>
//   ))}
// </div>

//                 <div className="chatBoxBottom">
//                   <textarea
//                     className="chatMessageInput"
//                     placeholder="write something..."
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     value={newMessage}
//                     disabled={isLoading} // Disable while loading
//                   ></textarea>
//                   <button
//                     className="chatSubmitButton"
//                     onClick={handleSubmit}
//                     disabled={isLoading} // Disable while loading
//                   >
//                     {isLoading ? "Sending..." : "Send"}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <span className="noConversationText">Open a conversation to start a chat.</span>
//             )}
//           </div>
//         </div>

//         <div className="chatOnline">
//           <div className="chatOnlineWrapper">
//             <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800/api";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useRef();
  const scrollRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Connect to socket
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL);

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Append incoming messages
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members?.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Handle online users
  useEffect(() => {
    const handleGetUsers = (users) => {
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f))
      );
    };

    if (user?._id) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", handleGetUsers);
    }

    return () => {
      socket.current.off("getUsers", handleGetUsers);
    };
  }, [user]);

  // Get user's conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/conversations/${user._id}`);
        setConversations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    getConversations();
  }, [user._id]);

  // Get messages for selected chat
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages/${currentChat?._id}`);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]); // fallback to empty array
      }
    };
    if (currentChat?._id) {
      getMessages();
    }
  }, [currentChat]);

  // Handle sending new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    setIsLoading(true);

    const receiverId = currentChat.members.find((m) => m !== user._id);

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`${API_URL}/api/messages`, message);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <Sidebar />
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {Array.isArray(messages) &&
                    messages.map((m, i) => (
                      <div ref={scrollRef} key={i}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="chatSubmitButton"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
