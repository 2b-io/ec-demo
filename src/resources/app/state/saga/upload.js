import { take, fork, put, select } from 'redux-saga/effects'

import upload from 'app/services/upload'

import { actions, selectors, types } from 'app/state/interface'
const getUploadIdentifier = function*() {
  while (true) {
    try {
      const a = yield take(types.upload.GET_UPLOAD_IDENTIFIER)
      const identifier = upload.getRequestId()
    } catch (e) {
      console.log('e', e);
    }
  }
}

export default function*() {
  yield take('@@INITIALIZED')
  yield fork(getUploadIdentifier)
}
