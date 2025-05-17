import { io } from "socket.io-client";

const socket = io("http://localhost:8800"); // matches your server

export default socket;