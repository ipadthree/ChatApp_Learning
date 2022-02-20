// 通过script tag得到的global variable
// 这就会hit server得io.on('connection'
const socket = io();

// Qs 也是用CDN script tag得到
// 从URL query param 得 username & room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// 发送加入room 信号给server
socket.emit("joinRoom", {
    username,
    room
})

// 发送消息
const chatForm = document.getElementById('chat-form')
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // .msg 直接access 对应id得element
    const message = e.target.elements.msg.value;
    // emit message to server
    socket.emit('chatMessage', message);
    // clear input box
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus();
})

// 监听在之前商量好的category 接受消息
socket.on("message", message => {
    console.log(message)
    outPutMessage(message)

    const chatMessages = document.querySelector('.chat-messages')
    // 新message scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// 接收room 信息
socket.on("roomUsers", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

function outPutMessage(message) {
    const div = document.createElement('div')
    div.classList.add("message")
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    const roomName = document.getElementById("room-name")
    roomName.innerText = room
}

function outputUsers(users) {
    const userList = document.getElementById('users')
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join(" ")}
    `
}

