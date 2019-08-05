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
          gravity,
          padding,
          opacity
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
        gravity,
        ...padding,
        opacity
      })

      plupItems.setOption('headers', {
        filetype: 'image',
        requestId,
      })

      plupItems.setOption('url',`/upload/${ requestId }/image`)

      plupTemplate.setOption('url', `/upload/${ requestId }/image`)

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

    if (statusCheck === 2) {
      const { linkDownload } = yield upload.processImage(requestId)

      if (linkDownload) {
        yield put(
          actions.processImageCompleted(linkDownload)
        )
      }
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
