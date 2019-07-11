import { take, fork, put, select } from 'redux-saga/effects'

import upload from 'app/services/upload'

import { actions, selectors, types } from 'state/interface'

const changePasswordLoop = function*() {
  while (true) {
    try {
      yield take(types.upload.GET_UPLOAD_IDENTIFIER)
    } catch (e) {

    }
  }
}
