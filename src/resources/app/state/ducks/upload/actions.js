import * as types from './types'

export const uploadFiles = (
  plupTemplate,
  plupItems,
  gravity,
  padding,
  opacity,
  modeResize,
  heightTemplate,
  widthTemplate,
  percentTemplate,
  widthPercentWatermark,
  heightPercentWatermark
) => ({
  type: types.UPLOAD_FILES,
  payload: {
    plupTemplate,
    plupItems,
    gravity,
    padding,
    opacity,
    modeResize,
    heightTemplate,
    widthTemplate,
    percentTemplate,
    widthPercentWatermark,
    heightPercentWatermark
  }
})

export const uploadFilesCompleted = (typeFile) => ({
  type: types.UPLOAD_FILES_COMPLETED,
  payload: { typeFile }
})

export const uploadFilesFailed = (reason) => ({
  type: types.UPLOAD_FILES_FAILED,
  payload: { reason }
})

export const getRequestIdCompleted = (requestId) => ({
  type: types.GET_UPLOAD_ID_COMPLETED,
  payload: { requestId }
})

export const processImageCompleted = (linkDownload) => ({
  type: types.PROGRESS_IMAGE_COMPLETED,
  payload: { linkDownload }
})
