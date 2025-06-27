import { configureStore, Tuple } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import reducer from '../reducers'
import mySaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer,
  middleware: () => new Tuple(sagaMiddleware),
})


sagaMiddleware.run(mySaga)

export default store;