import typePrefix from 'app/state/helpers/type-prefix'

const prefix = typePrefix('upload')

export const GET_UPLOAD_IDENTIFIER = prefix('GET_UPLOAD_IDENTIFIER')
export const GET_UPLOAD_IDENTIFIER_COMPLETED = prefix('GET_UPLOAD_IDENTIFIER_COMPLETED')
export const GET_UPLOAD_IDENTIFIER_FAILED = prefix('GET_UPLOAD_IDENTIFIER_FAILED')
