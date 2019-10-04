import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/layout/Header';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import TodoManager from './components/TodoManager';
import About from './components/pages/About';
import Chat from './components/Chat';

import './App.css';

// Sample TODOs from https://jsonplaceholder.typicode.com/todos

class App extends React.Component {
  state = {
    todos: []
  }

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10')
    .then(res => this.setState({ todos: res.data }))
  }

  // Toggle complete
  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo;
    }) });
  }

  // Add Todo
  addTodo = (title) => {
    axios.post('https://jsonplaceholder.typicode.com/todos', {
      title,
      completed: false
    })
      .then(res => this.setState({ todos: 
      [...this.state.todos, res.data]}));
      // note adding multiple items here the ID returned from site doesnt increment so duplicate keys happen
  }

  // Delete Todo
  delTodo = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(res => this.setState({ todos: this.state.todos.filter(todo => todo.id !== id)}));
    
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="app-container">
            <Header />
            <Route exact path="/" render={props => (
              <React.Fragment>
                <AddTodo addTodo={this.addTodo} />
                <Todos todos={this.state.todos} 
                  markComplete={this.markComplete}
                  delTodo={this.delTodo} />
                <TodoManager></TodoManager>
              </React.Fragment>
            )} />
            <Route path="/about" component={About} />
            <Route path="/chat" component={Chat} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
