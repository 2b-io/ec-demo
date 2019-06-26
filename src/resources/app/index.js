import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import ecDemo from 'app/state/reducers'

import App from 'app/views'

const store = createStore(ecDemo)

const root = document.getElementById('root')

render(<Provider store={store}>
    <App />
  </Provider>, root)
