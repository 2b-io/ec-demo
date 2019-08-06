import typePrefix from 'app/state/helpers/type-prefix'

const prefix = typePrefix('upload')

export const UPLOAD_FILES = prefix('UPLOAD_FILES')
export const UPLOAD_FILES_COMPLETED = prefix('UPLOAD_FILES_COMPLETED')
export const UPLOAD_FILES_FAILED = prefix('UPLOAD_FILES_FAILED')

export const GET_UPLOAD_ID_COMPLETED = prefix('GET_UPLOAD_ID_COMPLETED')

export const PROGRESS_IMAGE_COMPLETED = prefix('PROGRESS_IMAGE_COMPLETED')
