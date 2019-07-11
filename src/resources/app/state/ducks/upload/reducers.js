import createReducer from 'app/state/helpers/create-reducer'

import * as types from './types'

export default createReducer({})({
  [ types.GET_UPLOAD_IDENTIFIER_COMPLETED ]: (state, action) => ({
    ...state,
    [ action.payload.upload.identifier ]: action.payload.upload
  })
})
