import { applyMiddleware, compose, createStore } from 'redux'

import reducer from './reducer'
import middlewares, { initializeStoreDone } from './middlewares'

export default initialState => {
  // support REDUX Chrome Extension
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  )

  initializeStoreDone()

  return store
}
