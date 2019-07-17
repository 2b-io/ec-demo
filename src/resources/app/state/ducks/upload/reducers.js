import createReducer from 'app/state/helpers/create-reducer'

import * as types from './types'

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_UPLOAD_ID_COMPLETED:
      return {
        ...state,
        requestId: action.payload.requestId
      }
    case types.UPLOAD_FILES_FAILED:
      return false
    case types.UPLOAD_FILES_COMPLETED:
      let uploadFileType = []

      if (state.uploadFileType) {
        uploadFileType = [ ...state.uploadFileType, action.payload.typeFile ]
      }else {
        uploadFileType = [ action.payload.typeFile ]
      }

      return {
        ...state,
        uploadFileType
      }
  }
  return state
}
