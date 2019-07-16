import { take, fork, put, select, all } from 'redux-saga/effects'
import serializeError from 'serialize-error'

import upload from 'app/services/upload'

import { actions, selectors, types } from 'app/state/interface'

const getUploadIdentifierLoop = function*() {
  while (true) {
    try {
      const {
        payload: {
          plupTemplate,
          plupItems,
          gravity
        }
      } = yield take(types.upload.GET_UPLOAD_IDENTIFIER)

      const { requestId } = yield upload.getRequestId()

      if (!requestId) {
        throw 'Upload failed'
      }

      plupTemplate.setOption('headers', {
        filetype: 'watermark',
        requestId,
        gravity
      })

      plupItems.setOption('headers', {
        filetype: 'item',
        requestId,
      })

      plupItems.setOption('url',`http://localhost:3009/upload/${ requestId }/image`)

      plupTemplate.setOption('url', `http://localhost:3009/upload/${ requestId }/image`)

      plupTemplate.start()
      plupItems.start()

      yield put(
        actions.getUploadIdentifierCompleted(requestId)
      )
    } catch (e) {
      console.log('e', e);
      yield put(
        actions.getUploadIdentifierFailed(serializeError(e))
      )
    }
  }
}

export default function*() {
  yield all([
    take('@@INITIALIZED'),
    fork(getUploadIdentifierLoop)
  ])
}
