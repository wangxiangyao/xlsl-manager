import { combineReducers } from 'redux';
import orders from './orderTodo';
import filter from './filterTodo';
// 链接入各种reducer

const reducer = combineReducers ({
  orders,
  filter,
});

export default reducer;
