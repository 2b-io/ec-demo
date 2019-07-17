import apiService from 'app/services/api'

import config from 'infrastructure/config'

const getRequestId = async () => {
  return apiService.callApi('get', `/upload/identifier`)
}

const processImage = async (requestId) => {
  return apiService.callApi('post', `/upload/${ requestId }/image/process`)
}

export default {
  getRequestId,
  processImage
}
