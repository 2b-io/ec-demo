import apiService from 'app/services/api'

import config from 'infrastructure/config'

const getRequestId = async () => {
  return apiService.callApi('get', `/upload/identifier`)
}

export default {
  getRequestId
}
