import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger()

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    typeof window.devToolsExtension === 'function' ? window.devToolsExtension() : f => f
  ));
  return store;
}