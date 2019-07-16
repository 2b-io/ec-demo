import { take, fork, put, select, all } from 'redux-saga/effects'

import upload from 'app/services/upload'

import { actions, selectors, types } from 'app/state/interface'

const getUploadIdentifierLoop = function*() {
  while (true) {
    try {
      yield take(types.upload.GET_UPLOAD_IDENTIFIER)
      const identifier = upload.getRequestId()

    } catch (e) {
      console.log('e', e);
    }
  }
}

export default function*() {
  yield all([
    take('@@INITIALIZED'),
    fork(getUploadIdentifierLoop)
  ])
}
