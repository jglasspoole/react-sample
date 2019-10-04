import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT } from "../Events"
import ChatLoginForm from "./ChatLoginForm"
import ChatContainer from "./chats/ChatContainer"

const socketUrl = "http://192.168.2.51:3231/"
export class ChatLayout extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      socket : null,
      user: null
    };
  }

  componentDidMount() {
    this.initSocket();
  }

  // Setup the socket connection
  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log("Connected");
    })
    this.setState({socket});
  }

  // Set the user property in state
  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({user})
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({user : null})
  }

  render() {
    const { socket, user } = this.state;
    return (
      <div className="container">
        {
          !user ?
          <ChatLoginForm socket={socket} setUser={this.setUser} />
          :
          <ChatContainer socket={socket} user={user} logout={this.logout} />
        }
      </div>
    )
  }
}

export default ChatLayout
