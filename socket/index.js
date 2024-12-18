const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
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
    //when connect
    console.log("A user connected.");

    // Add user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log("Current Users:", users);
        io.emit("getUsers", users); // Emit updated user list
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    // Remove user on disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
        removeUser(socket.id);
        console.log("Updated Users After Disconnect:", users);
        io.emit("getUsers", users); // Emit updated user list
    });
});
