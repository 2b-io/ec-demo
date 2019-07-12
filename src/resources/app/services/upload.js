import request from 'superagent'

import config from 'infrastructure/config'

const getRequestId = async () => {
  return await request.get(`${ config.assetEndpoint }/requestid`)
}

export default {
  getRequestId
}
