import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducer'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(thunk)
    )
);
//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(createStore)

// const store = createStoreWithMiddleware(rootReducer)

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))
// )
//
//
export default store;
