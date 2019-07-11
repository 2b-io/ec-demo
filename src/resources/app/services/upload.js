import request from 'superagent'

import config from 'infrastructure/config'

const getRequestId = async () => {
  return await request.get(`${ config.serverEcDemo }/requestid`)
}

export default {
  getRequestId
}
