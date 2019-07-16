import * as types from './types'

export const getUploadIdentifier = (plupTemplate, plupItems, gravity) => ({
  type: types.GET_UPLOAD_IDENTIFIER,
  payload: { plupTemplate, plupItems, gravity }
})

export const getUploadIdentifierCompleted = (requestId) => ({
  type: types.GET_UPLOAD_IDENTIFIER_COMPLETED,
  payload: { requestId }
})

export const getUploadIdentifierFailed = (reason) => ({
  type: types.GET_UPLOAD_IDENTIFIER_FAILED,
  payload: { reason }
})
