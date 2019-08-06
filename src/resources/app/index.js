import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import initializeStore from 'app/state/store'

import App from 'app/views'

const store = initializeStore(window.REDUX_INITIAL_DATA)

const root = document.getElementById('root')

render(<Provider store={ store }>
    <App />
  </Provider>, root)
