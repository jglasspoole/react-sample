export const increment = (incrementVal) => {
  return {
    type: "INCREMENT",
    payload: incrementVal
  };
};

export const decrement = (decrementVal) => {
  return {
    type: "DECREMENT",
    payload: decrementVal
  };
};