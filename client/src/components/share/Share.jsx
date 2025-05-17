import { useContext, useRef, useState } from "react";
import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  // ...existing code...
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const uploadRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload`,
          data
        );
        newPost.img = uploadRes.data.url; // <-- S3 URL
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  // ...existing code...

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="shareProfileImage"
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            <img
              className="shareImage"
              src={URL.createObjectURL(file)}
              alt=""
            />
            <Cancel
              className="shareCancelImage"
              onClick={() => {
                setFile(null);
                document.querySelector(".shareBottom").reset();
              }}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
