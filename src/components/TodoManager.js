import React from 'react';
import {useDispatch} from 'react-redux';
import {increment, decrement} from '../actions';

function TodoManager() {
  const dispatch = useDispatch();

  return (
    <div>
      <button className="btn" onClick={() => dispatch(increment(3))}>Increment Todos Done</button>
      <button className="btn" onClick={() => dispatch(decrement(2))}>Decrement Todos Done</button>
    </div>
  )
}

export default TodoManager;
