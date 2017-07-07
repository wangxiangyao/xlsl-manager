import { combineReducers } from 'redux';
import orders from './orderTodo';
import filter from './filterTodo';
import goods from './goodsTodo';
// 链接入各种reducer

const reducer = combineReducers ({
  orders,
  filter,
  goods,
});

export default reducer;
