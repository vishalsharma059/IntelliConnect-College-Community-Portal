import { io } from "socket.io-client";

const socket = io("https://intelliconnect-college-community-portal.onrender.com"); // matches your server

export default socket;
