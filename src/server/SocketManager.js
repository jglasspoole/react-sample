const io = require('./index.js').io

const { COMMUNITY_CHAT, VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = { }

module.exports = function(socket) {
  console.log("Socket Id: " + socket.id);

  //Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if(isUser(connectedUsers, nickname)) {
      callback({ user: null, isUser : true })
    } else {
      callback({user: createUser({name:nickname}), isUser: false})
    }
  })

  //User Connects with username
  socket.on(USER_CONNECTED, (user)=> {
    connectedUsers = addUser(connectedUsers, user)
    socket.user = user

    io.emit(USER_CONNECTED, connectedUsers)
    console.log(connectedUsers);
  })

  //Handle community chat
  communityChat = createChat();
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  })

  //User disconnects

  //User logs out

}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to be added to the list
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user) {
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of the user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username) {
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username)
{
  return username in userList;
}