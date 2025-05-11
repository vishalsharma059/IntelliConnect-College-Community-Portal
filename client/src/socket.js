import { io } from "socket.io-client";

const socket = io("http://localhost:8900"); // matches your server

export default socket;