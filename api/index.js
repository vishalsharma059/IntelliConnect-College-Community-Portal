// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app); // Create HTTP server
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");
// const postRoute = require("./routes/posts");
// const conversationRoute = require("./routes/conversations");
// const messageRoute = require("./routes/messages");
// const router = express.Router();
// const path = require("path");
// const cors = require("cors");
// const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const { uploadFile } = require("./utils/s3");

// const cors = require('cors');

// app.use(cors({
//   origin: 'https://intelli-connect-college-community-portal.vercel.app', // no trailing slash here
//   credentials: true,
// }));

// // --- Socket.IO setup ---
// const { Server } = require("socket.io");

// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'https://intelli-connect-college-community-portal.vercel.app', // exact origin, no trailing slash
//     methods: ['GET', 'POST'],
//     credentials: true,
//   }
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   if (!users.some((user) => user.userId === userId)) {
//     users.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log("A user connected.");

//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const user = getUser(receiverId);
//     if (user) {
//       io.to(user.socketId).emit("getMessage", {
//         senderId,
//         text,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });
// // --- End Socket.IO setup ---

// dotenv.config();

// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Failed to connect to MongoDB', error);
//     process.exit(1);  
//   }
// }

// connectDB();

// app.use("/images", express.static(path.join(__dirname, "public/images")));

// //middleware

// app.use(cors({ origin: 'https://intelli-connect-college-community-portal.vercel.app/' })); // <-- update with your Vercel URL
// app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));

// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     const result = await uploadFile(req.file);
//     return res.status(200).json({ url: result.Location });
//   } catch (err) {
//     res.status(500).json("File upload failed");
//   }
// });

// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/conversations", conversationRoute);
// app.use("/api/messages", messageRoute);

// // Use process.env.PORT for deployment
// const PORT = process.env.PORT || 8800;
// server.listen(PORT, () => {
//   console.log(`Backend server is running on port ${PORT}!`);
// });

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadFile } = require("./utils/s3");

dotenv.config();

// CORS middleware — only once, no trailing slash in origin
app.use(cors({
  origin: 'https://intelli-connect-college-community-portal.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// --- Socket.IO setup ---
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: 'https://intelli-connect-college-community-portal.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected.");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
// --- End Socket.IO setup ---

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

connectDB();

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadFile(req.file);
    return res.status(200).json({ url: result.Location });
  } catch (err) {
    res.status(500).json("File upload failed");
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});
