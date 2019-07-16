import createReducer from 'app/state/helpers/create-reducer'

import * as types from './types'

export default (state = {}, action) => {

  switch (action.type) {
    case types.GET_UPLOAD_IDENTIFIER_COMPLETED:
      return action.payload.requestId
    case types.GET_UPLOAD_IDENTIFIER_FAILED:
      return false
  }

  return state
}
