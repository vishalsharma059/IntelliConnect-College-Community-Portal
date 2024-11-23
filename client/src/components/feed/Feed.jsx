import "./feed.css";
import Post from "../post/Post";
import Share from "../share/Share";
// import { Posts } from "../../dummyData";
import axios from "axios"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({username}) {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

      // Function to refresh posts
  const refreshProfile = async () => {
    try {
      const res = username
        ? await axios.get("http://localhost:8800/api/posts/profile/" + username)
        : await axios.get("http://localhost:8800/api/posts/timeline/" + user._id);
      setPosts(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)));
    } catch (err) {
      console.error("Error refreshing posts:", err);
    }
  };

    useEffect(() => {
        const fetchPosts = async () => {
                const res = username ?  await axios.get("http://localhost:8800/api/posts/profile/" + username):
                await axios.get("http://localhost:8800/api/posts/timeline/" + user._id);
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
                }));
        };
        fetchPosts();
        
    }, [username,user._id]);
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}
                {posts.map((p) => (
                    <Post key={p._id} post={p} refreshProfile={refreshProfile } />
                ))}
            </div>
        </div>
    )
}
