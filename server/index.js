const express = require("express");
const http = require("http");
const cors = require("cors");
const { connection } = require("./configs/db");
const { userController } = require("./controllers/user.routes");
const cookieParser = require("cookie-parser");
const { authorization } = require("./middlewares/authorization");
const { Server } = require("socket.io");
const { UserModel } = require("./models/user.model");
const { ChatMessageModel } = require("./models/message.model");

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://own-chat-app.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://own-chat-app.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "server is running" });
});
app.get("/user", (req, res) => {
  res.json({ message: "working" });
});
app.use("/user", userController);

const getLastMessages = async (room) => {
  let roomMessages = await ChatMessageModel.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messageByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
};

const sortRoomMessagesByDate = (messages) => {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
};

const fixMembers = (arr) => {
  return arr.map((e) => {
    return { _id: e._id, avatar: e.avatar, name: e.name, status: e.status };
  });
};

io.on("connection", (socket) => {
  //When user get connected he will recieve all the informetion of the members
  socket.on("new-user", async (_id) => {
    const User = await UserModel.findOneAndUpdate(
      { _id: _id },
      { status: "online" }
    );
    socket._id = _id;
    let members = await UserModel.find();

    members = fixMembers(members);
    io.emit("new-user", members);
  });

  //When he will switch from a room to the other room
  socket.on("join-room", async ({ newRoom, previousRoom }) => {
    socket.leave(previousRoom);
    socket.join(newRoom);
    let roomMessages = await getLastMessages(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on(
    "message-room",
    async ({ room, content, sender, time, date, type }) => {
      const newMessage = await ChatMessageModel.create({
        content,
        to: room,
        from: sender,
        time,
        date,
        type,
      });
      let roomMessages = await getLastMessages(room);
      roomMessages = sortRoomMessagesByDate(roomMessages);
      io.to(room).emit("room-messages", roomMessages);
      socket.broadcast.emit("notification", room, type, sender);
    }
  );

  socket.on("disconnect", async () => {
    if (socket._id) {
      const User = await UserModel.findOneAndUpdate(
        { _id: socket._id },
        { status: "offline" }
      );
      let members = await UserModel.find();
      members = fixMembers(members);
      socket.broadcast.emit("new-user", members);
    }
  });

  app.post("/user/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await UserModel.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      let members = await UserModel.find();
      members = fixMembers(members);
      socket.broadcast.emit("new-user", members);

      res.clearCookie("token");
      res.clearCookie("name");
      res.clearCookie("avatar");
      res.clearCookie("userId");

      res.json({ message: "logout succcessful" });
    } catch (e) {
      res.status(400).json({ message: "Something went wrong" });
    }
  });
});

httpServer.listen(PORT, async () => {
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log("Error while connection to db");
    console.log(error);
  }
  console.log("server is running");
});
