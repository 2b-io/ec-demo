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
      } = yield take(types.upload.UPLOAD_FILES)

      const { requestId } = yield upload.getRequestId()

      if (!requestId) {
        throw 'Upload failed'
      }

      yield put(
        actions.getRequestIdCompleted(requestId)
      )

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

    } catch (e) {
      console.log('e', e);
      yield put(
        actions.uploadFilesFailed(serializeError(e))
      )
    }
  }
}

const uploadLoop = function*() {
  while (true) {
    yield take(types.upload.UPLOAD_FILES_COMPLETED)

    const a = yield select(selectors.uploadIdentifier)
  }
}

export default function*() {
  yield all([
    take('@@INITIALIZED'),
    fork(getUploadIdentifierLoop),
    fork(uploadLoop)
  ])
}
