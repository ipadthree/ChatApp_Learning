const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user')


const app = express();
const server = http.createServer(app);
const io = socketio(server);


const BOT_NAME = "Admin Bot";

//把 public folder的 static client code host 起来
app.use(express.static(path.join(__dirname, "public")))

// Run web sockets when client connects
io.on('connection', (socket)=> {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        // socketio 自带的加入room的方法
        socket.join(user.room);

        // emit得第一个arg 相当于一个category identifier，和client商量好要用哪个category
        // 只给user自己
        socket.emit("message", formatMessage(BOT_NAME, "welcome to chatcord"));

        //Broadcast when a user connects, 除了user 自己外都收到
        socket.broadcast.to(user.room).emit('message', formatMessage(BOT_NAME, `User ${username} has joined the chat`))

        //Send usr and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // 接收client sent的message
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message",formatMessage(user.username, message))
    })

    // client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if(user) {
            //io.emit 给包括user自己都broadcast
            io.to(user.room).emit("message", formatMessage(BOT_NAME, `User ${user.username} has left the chat`))

            //Update usr and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`hit ${PORT}`))