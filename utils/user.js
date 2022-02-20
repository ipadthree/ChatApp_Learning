// database
const users = [];

function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1) {
        // splice作用于原来array，删除一个，并且返回删除的elements，是个array
        const restUsers = users.splice(index, 1)[0]
        return restUsers;
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}