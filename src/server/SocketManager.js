const io = require('./index.js').io

const { COMMUNITY_CHAT, VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
      LOGOUT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = { }

let communityChat = createChat();

module.exports = function(socket) {
  //console.log('\x1bc'); //clears console
  console.log("Socket Id: " + socket.id);

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

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

    sendMessageToChatFromUser = sendMessageToChat(user.name)
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)
    console.log(connectedUsers);
  })

  //User disconnects - i.e. refreshes the page, closes the page
  socket.on('disconnect', () => {
    if("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name)

      io.emit(USER_DISCONNECTED, connectedUsers)
      console.log("User disconnect", socket.user.name)
      console.log("User list", connectedUsers)
    }
  })

  //User logs out
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit(USER_DISCONNECTED, connectedUsers)
    console.log("Logout", socket.user.name)
    console.log("User list", connectedUsers)
  })

  //Get community chat
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  })

  socket.on(MESSAGE_SENT, ({chatId, message}) => {
    sendMessageToChatFromUser(chatId, message)
  })

  socket.on(TYPING, ({chatId, isTyping}) => {
    sendTypingFromUser(chatId, isTyping)
  })
}

/*
* sendMessageToChat
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of the sender
* @return function(chatId, message)
*/
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
  }
}

/*
* sendTypingToChat
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender{string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping})
  }
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