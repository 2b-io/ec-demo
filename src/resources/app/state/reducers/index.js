import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import files from './filesUpload'
export default combineReducers({
  form,
  files
})
