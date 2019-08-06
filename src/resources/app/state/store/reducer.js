import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import { reducers } from 'app/state/ducks'

const combined = combineReducers({
  ...reducers,
  form
})

export default (state = {}, action) => {
  if (action.type === '@@RESET') {
    return combined({}, action)
  }

  return combined(state, action)
}
