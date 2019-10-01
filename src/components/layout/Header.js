import React from 'react'
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';

function Header() {
  const counter = useSelector(state => state.counter);
  const isLogged = useSelector(state => state.isLogged);

  return (
    <header style={headerStyle}>
      <h1>TodoList</h1>
      <Link style={linkStyle} to="/">Home</Link> | <Link style={linkStyle} to="/about">About</Link> | <Link style={linkStyle} to="/chat">Chat</Link>
      
      {/* REDUX SPECIFIC VARS */}
      <h4>Items Counted: {counter}</h4>
      {isLogged ? <h3>Logged in as tester</h3> : ""}
    </header>
  )
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px'
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none'
}

export default Header;