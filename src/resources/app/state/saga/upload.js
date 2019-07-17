import { take, fork, put, select, all } from 'redux-saga/effects'
import serializeError from 'serialize-error'

import upload from 'app/services/upload'

import { actions, selectors, types } from 'app/state/interface'


const STATUS_TYPE_FILE = ['UPLOAD_TEMPLATE_COMPLETED', 'UPLOAD_ITEMS_COMPLETED']

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

    const { uploadFileType, requestId } = yield select(selectors.uploadIdentifier)

    let statusCheck = 0
    uploadFileType.map((element) => {
      if (STATUS_TYPE_FILE.indexOf(element) !== -1 ) {
        ++statusCheck
      }
    })

    console.log('statusCheck', statusCheck)
    if (statusCheck === 2) {
      yield upload.processImage(requestId)
    }

  }
}

export default function*() {
  yield all([
    take('@@INITIALIZED'),
    fork(getUploadIdentifierLoop),
    fork(uploadLoop)
  ])
}
