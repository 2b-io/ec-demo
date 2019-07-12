import createSagaMiddleware from 'redux-saga'

import { all, fork } from 'redux-saga/effects'

import * as saga from 'app/state/saga'

const sagaMiddleware = createSagaMiddleware()
const rootSaga = function*() {
  try {
    yield all(
      Object.values(saga).map(f => fork(f))
    )
  } catch (e) {
    console.warn('Unhandled Exception in Saga', e)
  }
}

export default [
  sagaMiddleware
]

export const initializeStoreDone = () => {
  sagaMiddleware.run(rootSaga)
}
